import * as React from 'react';
import { View, StyleSheet, Animated, PanResponder} from 'react-native';

interface Props {
    width: number,
    height: number
    setFrame : (x1: number, x2: number, y1: number, y2: number) => void,
}

interface State {
    pan1: any, //TODO
    pan2: any, //TODO
}

export default class EditionTool extends React.Component<Props, State>{
    panResponder1 : any; //TODO
    panResponder2 : any; //TODO
    panResponder3 : any; //TODO
    panResponder4 : any; //TODO
    constructor(props){
        super(props);
        this.state = {
            pan1 : new Animated.ValueXY({x: 0, y: 0}),
            pan2 : new Animated.ValueXY({x: this.props.width, y: this.props.height}),
        };

        this.panResponder1 = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.pan1.setOffset({x: this.state.pan1.x._value, y: this.state.pan1.y._value});
                this.state.pan1.setValue({x: 0, y: 0});
            },
            onPanResponderMove: Animated.event([null,{
                dx: this.state.pan1.x,
                dy: this.state.pan1.y
            }]),
            onPanResponderRelease: () => this.checkBoundariesAndSave()

        });

        this.panResponder2 = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.pan2.setOffset({x: this.state.pan2.x._value, y: this.state.pan2.y._value});
                this.state.pan2.setValue({x: 0, y: 0});
            },
            onPanResponderMove: Animated.event([null,{
                dx: this.state.pan2.x,
                dy: this.state.pan2.y
            }]),
            onPanResponderRelease: () => this.checkBoundariesAndSave()
        });

        this.panResponder3 = PanResponder.create({
            onStartShouldSetPanResponder    : () => true,
            onPanResponderGrant: () => {
                this.state.pan2.setOffset({x: this.state.pan2.x._value, y: this.state.pan2.y._value});
                this.state.pan2.setValue({x: 0, y: 0});
                this.state.pan1.setOffset({x: this.state.pan1.x._value, y: this.state.pan1.y._value});
                this.state.pan1.setValue({x: 0, y: 0});
            },
            onPanResponderMove: Animated.event([null,{
                dx  : this.state.pan1.x,
                dy  : this.state.pan2.y
            }]),
            onPanResponderRelease: () => this.checkBoundariesAndSave()
        });

        this.panResponder4 = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.pan2.setOffset({x: this.state.pan2.x._value, y: this.state.pan2.y._value});
                this.state.pan2.setValue({x: 0, y: 0});
                this.state.pan1.setOffset({x: this.state.pan1.x._value, y: this.state.pan1.y._value});
                this.state.pan1.setValue({x: 0, y: 0});
            },
            onPanResponderMove: Animated.event([null,{
                dx: this.state.pan2.x,
                dy: this.state.pan1.y
            }]),
            onPanResponderRelease: () => this.checkBoundariesAndSave()
        });
    }

    checkBoundariesAndSave() :void{
        this.state.pan2.flattenOffset();
        this.state.pan1.flattenOffset();

        if (this.state.pan1.x._value<0) this.state.pan1.setValue({x:0, y: this.state.pan1.y._value});
        if (this.state.pan2.x._value>this.props.width) this.state.pan2.setValue({x:this.props.width, y: this.state.pan2.y._value});
        if (this.state.pan1.x._value>this.props.width) this.state.pan1.setValue({x:this.props.width, y: this.state.pan1.y._value});
        if (this.state.pan2.x._value<0) this.state.pan2.setValue({x:0, y: this.state.pan2.y._value});
        if (this.state.pan1.y._value<0) this.state.pan1.setValue({y:0, x: this.state.pan1.x._value});
        if (this.state.pan2.y._value>this.props.height) this.state.pan2.setValue({y:this.props.height, x: this.state.pan2.x._value});
        if (this.state.pan1.y._value>this.props.height) this.state.pan1.setValue({y:this.props.height, x: this.state.pan1.x._value});
        if (this.state.pan2.y._value<0) this.state.pan2.setValue({y:0, x: this.state.pan2.x._value});

        this.props.setFrame(this.state.pan1.x._value, this.state.pan2.x._value, this.state.pan1.y._value, this.state.pan2.y._value);
    }

    render() {
        return (
            <View style={{width: this.props.width+20, height: this.props.height+20}}>
                <Animated.View
                    {...this.panResponder1.panHandlers}
                    style={[this.state.pan1.getLayout(), styles.circle]}>
                </Animated.View>
                <Animated.View
                    {...this.panResponder2.panHandlers}
                    style={[this.state.pan2.getLayout(), styles.circle]}>
                </Animated.View>
                <Animated.View
                    {...this.panResponder3.panHandlers}
                    style={[{left: this.state.pan1.getLayout().left, top: this.state.pan2.getLayout().top}, styles.circle]}>
                </Animated.View>
                <Animated.View
                    {...this.panResponder4.panHandlers}
                    style={[{left: this.state.pan2.getLayout().left, top: this.state.pan1.getLayout().top}, styles.circle]}>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        opacity: 0.5
    },
    circle      : {
        position: 'absolute',
        backgroundColor     : '#1abc9c',
        width               : 20,
        height              : 20,
        borderRadius        : 10
    }
});