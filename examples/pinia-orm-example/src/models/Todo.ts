import { Model } from 'pinia-orm'
import stringify from 'json-stringify-safe'

export class Todo extends Model {
  static entity = 'todos'

  static fields() {
    return {
      id: this.uid(),
      title: this.string(''),
      done: this.boolean(false),
    }
  }

  static piniaOptions = {
    persistedState: {
      serialize: (state: unknown) => {
        return stringify(state)
      },
      deserialize: (value: string) => {
        return JSON.parse(value)
      },
    },
  }

  // For typescript support of the field include also the next lines
  declare id: string
  declare title: string
  declare done: boolean
}
