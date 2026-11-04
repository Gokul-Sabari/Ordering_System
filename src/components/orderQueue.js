/**
 * Advanced Order Submission Queue & Idempotency Manager
 *
 * Features:
 * 1. Strict Sequential (FIFO) Async Queueing: Serializes order submissions in proper async-await queue manner.
 * 2. Client Transaction & Idempotency Key Generation: Attaches unique RequestId / Client_Txn_Id.
 * 3. Payload Fingerprinting: Prevents identical duplicate submissions within a time window (15s).
 * 4. High-Concurrency Safety: Handles rapid hits smoothly with zero database collisions.
 */

class OrderQueueManager {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.recentFingerprints = new Map();
    this.CLEANUP_WINDOW_MS = 15000; // 15-second duplicate protection window
  }

  /**
   * Generate a unique request transaction ID
   */
  generateRequestId() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `REQ_${timestamp}_${randomStr}`;
  }

  /**
   * Generate a fingerprint hash for an order payload
   */
  generateFingerprint(saleData) {
    try {
      const customerId = saleData?.customerId || saleData?.generalInfo?.Retailer_Id || "";
      const totalAmount = saleData?.totalAmount || saleData?.generalInfo?.Total_Invoice_value || 0;
      const totalItems = saleData?.totalItems || 0;
      const isEditing = saleData?.generalInfo?.So_Id || saleData?.generalInfo?.Alter_Id || "new";

      const itemsSummary = (saleData?.stockInfo || [])
        .map((item) => `${item.Product_Id || item.Item_Id}:${item.Quantity || item.Total_Qty}:${item.Item_Rate || item.Price}`)
        .sort()
        .join("|");

      return `${customerId}_${isEditing}_${totalAmount}_${totalItems}_${itemsSummary}`;
    } catch {
      return null;
    }
  }

  /**
   * Check if an order is a duplicate within the time window
   */
  isDuplicate(fingerprint) {
    if (!fingerprint) return false;
    const lastTimestamp = this.recentFingerprints.get(fingerprint);
    if (lastTimestamp && Date.now() - lastTimestamp < this.CLEANUP_WINDOW_MS) {
      return true;
    }
    return false;
  }

  /**
   * Record a processed fingerprint
   */
  recordFingerprint(fingerprint) {
    if (!fingerprint) return;
    this.recentFingerprints.set(fingerprint, Date.now());
    setTimeout(() => {
      this.recentFingerprints.delete(fingerprint);
    }, this.CLEANUP_WINDOW_MS);
  }

  /**
   * Enqueue an order submission task and execute in strict FIFO queue manner
   */
  enqueue(saleData, taskFn) {
    return new Promise((resolve, reject) => {
      const requestId = this.generateRequestId();
      const fingerprint = this.generateFingerprint(saleData);

      // Attach idempotency tracking identifiers to saleData & generalInfo
      if (saleData) {
        saleData.requestId = requestId;
        saleData.clientTxnId = requestId;
        if (saleData.generalInfo) {
          saleData.generalInfo.RequestId = requestId;
          saleData.generalInfo.Client_Txn_Id = requestId;
        }
      }

      // Check duplicate payload within time window
      if (fingerprint && this.isDuplicate(fingerprint)) {
        return resolve({
          success: false,
          isDuplicate: true,
          message: "Duplicate order detected. This order is already being processed or was recently submitted.",
        });
      }

      // Record fingerprint immediately to lock duplicates
      if (fingerprint) {
        this.recordFingerprint(fingerprint);
      }

      this.queue.push({
        requestId,
        fingerprint,
        taskFn,
        resolve,
        reject,
      });

      this.processQueue();
    });
  }

  /**
   * Process queue items one by one asynchronously
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const currentTask = this.queue.shift();

    try {
      const result = await currentTask.taskFn(currentTask.requestId);
      currentTask.resolve(result);
    } catch (error) {
      currentTask.reject(error);
    } finally {
      this.isProcessing = false;
      if (this.queue.length > 0) {
        queueMicrotask(() => this.processQueue());
      }
    }
  }
}

export const orderQueue = new OrderQueueManager();
