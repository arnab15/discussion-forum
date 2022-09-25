const { logger } = require("../logger");
require("dotenv").config();
const AZURE_STORAGE_ACCOUNT = process.env.AZURE_STORAGE_ACCOUNT;
const AZURE_STORAGE_ACCESS_KEY = process.env.AZURE_STORAGE_ACCESS_KEY;
const {
    StorageSharedKeyCredential,
    BlobServiceClient,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
} = require("@azure/storage-blob");

exports.generateFileUploadUrl = async (fileName, userId) => {
    if (!userId) {
        throw new Error("User Id is required");
    }
    const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY);

    const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
        sharedKeyCredential
    );
    const containerName = "images";
    const blobName = `${userId}/${fileName}`;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const sasToken = generateBlobSASQueryParameters(
        {
            containerName: containerName,
            blobName: blobName,
            expiresOn: new Date(new Date().valueOf() + 86400),
            permissions: BlobSASPermissions.parse("w"),
        },
        sharedKeyCredential
    );

    const sasUrl = `${blockBlobClient.url}?${sasToken}`;
    logger.info(`SAS URL: ${sasUrl}`);

    return {
        sasUrl,
        url: blockBlobClient.url,
    };
};
