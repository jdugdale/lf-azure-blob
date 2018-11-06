const azure = require('azure-storage');

/** Class for Blobs */
class Blob {
    constructor(accountName, accountKey) {
        accountName = accountName || process.env.AZURE_ACCT;
        accountKey = accountKey || process.env.AZURE_KEY;
        this.blobSvc = azure.createBlobService(accountName, accountKey);
    }

    /**
     * Upload text content to Azure blob storage
     * @param {string} container Blob container name
     * @param {string} path Path to blob within container
     * @param {string} content Content to upload
     */
    async postText(container, path, content) {
        return new Promise((resolve, reject) => {
            try {
                this.blobSvc.createContainerIfNotExists(container, err => {
                    if(err) reject(err);
                    this.blobSvc.createBlockBlobFromText(container, path, content, err => {
                        if(err) reject(err);
                        else resolve();
                    });
                });
            } catch(err) {
                reject(err);
            }
        });
    }


    /**
     * Upload a JSON object to Azure blob storage
     * @param {string} container Blob container name
     * @param {string} path Path to blob within container
     * @param {object} obj JSON object to upload
     */
    async postJSON(container, path, obj) {
        try {
            return await this.postText(container, path, JSON.stringify(obj));
        } catch(err) {
            throw err;
        }
    }

    /**
     * Retrieve text content from Azure blob storage
     * @param {string} container Blob container name
     * @param {string} path Path to blob within container
     */
    getText(container, path) {
        return new Promise((resolve, reject) => {
            try {
                this.blobSvc.getBlobToText(container, path, (err, result) => {
                    if(err) reject(err);
                    else resolve(result);
                });
            } catch(e) {
                reject(e);
            }
        });
    }

    /**
     * Retrieve a JSON object from Azure blob storage
     * @param {string} container Blob container name
     * @param {string} path Path to blob within container
     */
    async getJSON(container, path) {
        try {
            let value = await this.getText(container, path);
            return JSON.parse(value);
        } catch(err) {
            throw err;
        }
    }


    /**
     * List all blob containers in the storage account
     */
    async listContainers() {
        return new Promise((resolve, reject) => {
            this.blobSvc.listContainersSegmented(null, (err, result) => {
                if(err) reject(err);
                else resolve(result);
            });
        });
    };

    /**
     * List all blobs in the specified container
     * @param {string} container Blob container name
     */
    async listBlobs(container) {
        return new Promise((resolve, reject) => {
            this.blobSvc.listBlobsSegmented(container, null, (err, result) => {
                if(err) reject(err);
                else resolve(result);
            });
        })
    };

    /**
     * Delete a blob
     * @param {string} container Blob container name
     * @param {string} path Path to blob within container
     */
    async deleteBlob(container, path) {
        return new Promise((resolve, reject) => {
            this.blobSvc.deleteBlobIfExists(container, path, (err, result) => {
                if(err) reject(err);
                else resolve(result);
            });
        });
    };

}

module.exports = Blob;