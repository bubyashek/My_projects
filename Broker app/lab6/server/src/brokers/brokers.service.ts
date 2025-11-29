import { Injectable } from '@nestjs/common';
import { Broker } from './broker.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BrokersService {
  private brokersFilePath: string;

  constructor() {
    const dataPath = process.env.DATA_PATH || '../../lab5/server/data';
    // Use process.cwd() which is the server directory
    this.brokersFilePath = path.resolve(process.cwd(), dataPath, 'brokers.json');
    console.log('📁 Brokers file path:', this.brokersFilePath);
    this.initializeBrokersFile();
  }

  private initializeBrokersFile() {
    console.log(`🔍 Checking if brokers file exists: ${this.brokersFilePath}`);
    console.log(`   File exists: ${fs.existsSync(this.brokersFilePath)}`);
    
    if (!fs.existsSync(this.brokersFilePath)) {
      const dir = path.dirname(this.brokersFilePath);
      console.log(`   Creating directory: ${dir}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      console.log(`   Creating empty brokers file`);
      fs.writeFileSync(this.brokersFilePath, JSON.stringify([], null, 2));
    }
  }

  private readBrokers(): Broker[] {
    try {
      const data = fs.readFileSync(this.brokersFilePath, 'utf-8');
      const brokers = JSON.parse(data);
      console.log(`📊 Read ${brokers.length} brokers from file`);
      // Normalize portfolio format for compatibility with lb5
      const normalized = brokers.map(broker => ({
        ...broker,
        portfolio: this.normalizePortfolio(broker.portfolio || {})
      }));
      console.log(`✅ Normalized ${normalized.length} brokers`);
      return normalized;
    } catch (error) {
      console.error('❌ Error reading brokers:', error);
      return [];
    }
  }

  private normalizePortfolio(portfolio: any): any {
    const normalized: any = {};
    const entries = Object.entries(portfolio);
    console.log(`  Portfolio has ${entries.length} entries`);
    
    for (const [symbol, data] of entries) {
      if (typeof data === 'number') {
        // lb5 format: just quantity
        normalized[symbol] = {
          quantity: data,
          purchasePrice: 0,
          purchaseDate: new Date().toLocaleDateString('ru-RU')
        };
      } else if (data && typeof data === 'object') {
        // lb6 format: full object
        normalized[symbol] = data;
      }
    }
    return normalized;
  }

  private writeBrokers(brokers: Broker[]): void {
    fs.writeFileSync(this.brokersFilePath, JSON.stringify(brokers, null, 2));
  }

  getAllBrokers(): Broker[] {
    console.log('🔍 getAllBrokers() called');
    const brokers = this.readBrokers();
    console.log(`📤 Returning ${brokers.length} brokers`);
    return brokers;
  }

  getBrokerById(id: string): Broker | undefined {
    const brokers = this.readBrokers();
    return brokers.find(b => b.id === id);
  }

  createBroker(name: string, initialFunds: number = 10000): Broker {
    const brokers = this.readBrokers();
    const newBroker: Broker = {
      id: Date.now().toString(),
      name,
      initialFunds,
      currentFunds: initialFunds,
      portfolio: {},
    };
    brokers.push(newBroker);
    this.writeBrokers(brokers);
    return newBroker;
  }

  updateBroker(id: string, updates: Partial<Broker>): Broker | undefined {
    const brokers = this.readBrokers();
    const index = brokers.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    
    brokers[index] = { ...brokers[index], ...updates };
    this.writeBrokers(brokers);
    return brokers[index];
  }

  deleteBroker(id: string): boolean {
    const brokers = this.readBrokers();
    const filtered = brokers.filter(b => b.id !== id);
    if (filtered.length === brokers.length) return false;
    this.writeBrokers(filtered);
    return true;
  }

  buyStock(brokerId: string, symbol: string, quantity: number, price: number, date: string): Broker | null {
    const broker = this.getBrokerById(brokerId);
    if (!broker) return null;

    const totalCost = price * quantity;
    if (broker.currentFunds < totalCost) {
      throw new Error('Insufficient funds');
    }

    broker.currentFunds -= totalCost;
    
    const existing = broker.portfolio[symbol];
    if (existing && typeof existing === 'object') {
      const totalQuantity = existing.quantity + quantity;
      const avgPrice = (existing.purchasePrice * existing.quantity + price * quantity) / totalQuantity;
      broker.portfolio[symbol] = {
        quantity: totalQuantity,
        purchasePrice: avgPrice,
        purchaseDate: existing.purchaseDate, // Keep original purchase date
      };
    } else {
      broker.portfolio[symbol] = {
        quantity,
        purchasePrice: price,
        purchaseDate: date,
      };
    }

    this.updateBroker(brokerId, broker);
    return broker;
  }

  sellStock(brokerId: string, symbol: string, quantity: number, price: number): Broker | null {
    const broker = this.getBrokerById(brokerId);
    if (!broker) return null;

    const existing = broker.portfolio[symbol];
    if (!existing || typeof existing === 'number' || existing.quantity < quantity) {
      throw new Error('Insufficient stock quantity');
    }

    broker.currentFunds += price * quantity;
    existing.quantity -= quantity;

    if (existing.quantity === 0) {
      delete broker.portfolio[symbol];
    }

    this.updateBroker(brokerId, broker);
    return broker;
  }
}

