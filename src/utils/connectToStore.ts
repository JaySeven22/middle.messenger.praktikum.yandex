import Block from '../framework/block';
import store from '../framework/store';
import isEqual from './isEqual';
import type { Indexed } from './merge';

type ConcreteBlock = Block & { template: string };
type ConcreteBlockCtor = new (...args: unknown[]) => ConcreteBlock;

function connect(mapStateToProps: (state: Indexed) => Indexed) {
  return function (Component: typeof Block): ConcreteBlockCtor {
    const Base = Component as unknown as ConcreteBlockCtor;

    const Connected = class extends Base {
      constructor(...args: unknown[]) {
        const props = (args[0] ?? {}) as Indexed;
        let state = mapStateToProps(store.getState());

        super({ ...props, ...state });

        store.subscribe(() => {
          const newState = mapStateToProps(store.getState());

          if (!isEqual(state, newState)) {
            this.setProps({ ...newState });
          }

          state = newState;
        });
      }
    };

    return Connected;
  };
}

export default connect;
