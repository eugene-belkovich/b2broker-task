import cluster from 'node:cluster';
import os from 'node:os';
import {Injectable} from '@nestjs/common';

const numCPUs = os.cpus().length;

@Injectable()
export class AppClusterService {
  static async clusterize(callback: (pid: number) => Promise<void>) {
    console.log(`Number of CPUs: ${numCPUs}`);
    console.log(`cluster.isMaster: ${cluster.isMaster}`);

    if (cluster.isMaster) {
      console.log(`Master server started on ${process.pid}`);
      for (let i = 0; i < 1; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      console.log(`Cluster server started on ${process.pid}`);
      callback(process.pid);
    }
  }
}
