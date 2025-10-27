import { Injectable, ErrorHandler } from '@angular/core';
import Rollbar from 'rollbar';
import { environment } from '../../environments/environment';

// Rollbar configuration from environment
const rollbarConfig = {
  accessToken: environment.rollbar.accessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: environment.rollbar.enabled,
  environment: environment.rollbar.environment,
  payload: {
    client: {
      javascript: {
        code_version: '1.4.0',
        source_map_enabled: true
      }
    }
  }
};

const rollbar = new Rollbar(rollbarConfig);

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  
  constructor() {
    console.log('🔧 GlobalErrorHandler initialized');
    console.log('📊 Rollbar status:', rollbarConfig.enabled ? '✅ Enabled' : '⚠️  Disabled');
    console.log('🌍 Environment:', rollbarConfig.environment);
  }

  handleError(error: any): void {
    // Log error to console (always)
    console.error('❌ Error occurred:', error);
    
    // Prepare error information
    const errorInfo = {
      message: error.message || 'Unknown error',
      stack: error.stack || '',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      type: error.name || 'Error'
    };
    
    // Log structured error to console
    console.group('📋 Error Details');
    console.table(errorInfo);
    console.groupEnd();
    
    // Send to Rollbar if enabled
    if (rollbarConfig.enabled) {
      try {
        rollbar.error(error, errorInfo);
        console.log('✅ Error sent to Rollbar');
      } catch (rollbarError) {
        console.error('❌ Failed to send to Rollbar:', rollbarError);
      }
    } else {
      console.log('⚠️  Rollbar is disabled.');
      console.log('📝 To enable Rollbar:');
      console.log('   1. Get your token from https://rollbar.com/');
      console.log('   2. Edit src/environments/environment.ts');
      console.log('   3. Set rollbar.accessToken to your token');
      console.log('   4. Set rollbar.enabled to true');
    }
    
    // Send to backend error log
    this.logErrorToBackend(errorInfo);
  }

  private logErrorToBackend(errorInfo: any): void {
    // Send error to backend for logging
    fetch(`${environment.apiUrl}/errors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo)
    })
    .then(() => console.log('✅ Error logged to backend'))
    .catch(err => console.error('❌ Failed to log error to backend:', err));
  }
}

// Export rollbar instance for manual logging
export { rollbar };
