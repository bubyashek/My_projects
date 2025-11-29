import { Injectable } from '@nestjs/common';
import { Broker } from './broker.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BrokersService {
  private readonly dataPath = path.join(__dirname, '../../data/brokers.json');
  private brokers: Broker[] = [];

  constructor() {
    this.loadBrokers();
  }

  private loadBrokers(): void {
    try {
      const dataDir = path.dirname(this.dataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, 'utf-8');
        this.brokers = JSON.parse(data);
      } else {
        this.brokers = this.getDefaultBrokers();
        this.saveBrokers();
      }
    } catch (error) {
      console.error('Error loading brokers:', error);
      this.brokers = this.getDefaultBrokers();
    }
  }

  private getDefaultBrokers(): Broker[] {
    return [
      {
        id: '1',
        name: 'Broker Alpha',
        initialFunds: 100000,
        currentFunds: 100000,
        portfolio: {},
      },
      {
        id: '2',
        name: 'Broker Beta',
        initialFunds: 150000,
        currentFunds: 150000,
        portfolio: {},
      },
    ];
  }

  private saveBrokers(): void {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.brokers, null, 2));
    } catch (error) {
      console.error('Error saving brokers:', error);
    }
  }

  getAllBrokers(): Broker[] {
    return this.brokers;
  }

  getBrokerById(id: string): Broker | undefined {
    return this.brokers.find((broker) => broker.id === id);
  }

  createBroker(broker: Omit<Broker, 'id' | 'portfolio' | 'currentFunds'>): Broker {
    const newBroker: Broker = {
      ...broker,
      id: Date.now().toString(),
      currentFunds: broker.initialFunds,
      portfolio: {},
    };
    this.brokers.push(newBroker);
    this.saveBrokers();
    return newBroker;
  }

  updateBroker(id: string, updates: Partial<Broker>): Broker | undefined {
    const index = this.brokers.findIndex((broker) => broker.id === id);
    if (index === -1) return undefined;

    this.brokers[index] = { ...this.brokers[index], ...updates };
    this.saveBrokers();
    return this.brokers[index];
  }

  deleteBroker(id: string): boolean {
    const initialLength = this.brokers.length;
    this.brokers = this.brokers.filter((broker) => broker.id !== id);
    
    if (this.brokers.length < initialLength) {
      this.saveBrokers();
      return true;
    }
    return false;
  }

  resetBrokerFunds(id: string): Broker | undefined {
    const broker = this.getBrokerById(id);
    if (!broker) return undefined;

    broker.currentFunds = broker.initialFunds;
    broker.portfolio = {};
    this.saveBrokers();
    return broker;
  }
}

