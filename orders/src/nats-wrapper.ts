import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
  private _client?: Stan

  // getter: access client from outside the class
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before establishing a connection to NATS server')
    }
    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url })

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS server')
        resolve()
      })
      this.client.on('error', (err) => {
        console.log(`Error connecting to NATS server: ${err}`)
        reject(err)
      })
    })
  }

  close() {
    // listen to a client connection close event and exit process gracefully
    this.client.on('close', () => {
      console.log('NATS connection closed')
      process.exit()
    })

    // Nodejs runtime process listening to the interrupt signal
    process.on('SIGINT', () => this.client.close())

    // Nodejs runtime process listening to the terminate signal
    process.on('SIGTERM', () => this.client.close())
  }
}

export const natsWrapper = new NatsWrapper()