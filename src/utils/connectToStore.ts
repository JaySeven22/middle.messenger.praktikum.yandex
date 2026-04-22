import Block from '../framework/block';
import store from '../framework/store';
import isEqual from './isEqual';
import type { Indexed } from './merge';

function connect(mapStateToProps: (state: Indexed) => Indexed) {
  return function(Component: typeof Block) {
    return class extends (Component as any) {
      constructor(props: any) {
        // сохраняем начальное состояние
        let state = mapStateToProps(store.getState());

        super({ ...props, ...state });
    
        // подписываемся на событие
        store.subscribe(() => {
          // при обновлении получаем новое состояние
          const newState = mapStateToProps(store.getState());
        
          // если что-то из используемых данных поменялось, обновляем компонент
          if (!isEqual(state, newState)) {
            this.setProps({ ...newState });
          }

          // не забываем сохранить новое состояние
          state = newState;
        });
      }
    }
  }
}
    

export default connect;
