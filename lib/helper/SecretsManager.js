/* eslint-disable import/no-extraneous-dependencies */
const {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  PutSecretValueCommand,
  UpdateSecretCommand,
  DeleteSecretCommand,
} = require('@aws-sdk/client-secrets-manager');

class SecretsManager {
  constructor(region) {
    this.client = new SecretsManagerClient({
      region: region || 'ap-southeast-1',
      // logger: console,
    });
  }

  async createSecret(secretName, secretString, options = {}) {
    try {
      const response = await this.client.send(
        new CreateSecretCommand({
          Name: secretName,
          SecretString: secretString,
          ...options,
        }),
      );
      return response;
    } catch (error) {
      console.error('🚀 ~ SecretsManager ~ createSecret ~ error:', error);
      throw error;
    }
  }

  async putSecertString(secretId, secretString) {
    try {
      const oldSecretString = await this.getSecretString(secretId);
      const response = await this.client.send(
        new PutSecretValueCommand({
          SecretId: secretId,
          SecretString: JSON.stringify({ ...oldSecretString, ...secretString }),
        }),
      );
      return response;
    } catch (error) {
      console.error('🚀 ~ SecretsManager ~ putSecertString ~ error:', error);
      throw error;
    }
  }

  async updateSecertString(secretId, secretString) {
    try {
      const response = await this.client.send(
        new UpdateSecretCommand({
          SecretId: secretId,
          SecretString: JSON.stringify(secretString),
        }),
      );
      return response;
    } catch (error) {
      console.error('🚀 ~ SecretsManager ~ updateSecertString ~ error:', error);
      throw error;
    }
  }

  async getSecretStringResponseAll(secretId, versionStage = null) {
    try {
      const response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: secretId,
          VersionStage: versionStage,
        }),
      );
      return response;
    } catch (error) {
      console.error(
        '🚀 ~ SecretsManager ~ getSecretStringResponseAll ~ error:',
        error,
      );
      throw error;
    }
  }

  async getSecretString(secret_name) {
    try {
      const response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: 'AWSCURRENT',
        }),
      );
      return JSON.parse(response.SecretString);
    } catch (error) {
      console.error('🚀 ~ SecretsManager ~ getSecretString ~ error:', error);
      throw error;
    }
  }

  async getSecretStringPlaintext(secret_name) {
    try {
      const response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: 'AWSCURRENT',
        }),
      );
      return response.SecretString;
    } catch (error) {
      console.error(
        '🚀 ~ SecretsManager ~ getSecretStringPlaintext ~ error:',
        error,
      );
      throw error;
    }
  }

  async deleteSecretString(secret_name, RecoveryWindowInDays = 7) {
    try {
      const response = await this.client.send(
        new DeleteSecretCommand({
          RecoveryWindowInDays,
          SecretId: secret_name,
        }),
      );
      return response;
    } catch (error) {
      console.error('🚀 ~ SecretsManager ~ deleteSecretString ~ error:', error);
      throw error;
    }
  }
}

module.exports = SecretsManager;
