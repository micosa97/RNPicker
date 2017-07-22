import * as React from 'react';

import {StackNavigator} from 'react-navigation'

import {Selector} from './Selector'
import {Editor} from "./Editor/Editor";


export const AppNav = StackNavigator({
    Home: { screen: Selector },
    Editor: { screen: Editor }
});


