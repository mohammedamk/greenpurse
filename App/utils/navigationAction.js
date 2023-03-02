import { NavigationActions } from 'react-navigation';

let _container;

function setContainer (container) {
	_container = container
}

export const backAction = key => NavigationActions.back({
  key,
});

export default {
  backAction,
  setContainer,
};