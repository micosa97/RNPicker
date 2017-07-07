import * as React from 'react';
import {View, StyleSheet, Image, Dimensions, ImageEditor, ToastAndroid, CameraRoll} from 'react-native';
import Button from 'react-native-button';
import EditionTool from "./EditionTool";
interface Props {
    navigation: any;
}
interface State {
    height: number;
    width: number;
    scale: number;
    frame: {
        x1 : number,
        x2 : number,
        y1 : number,
        y2 : number,
    }
}
export default class Editor extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        let scale = Math.min((Dimensions.get('window').width) * 0.7 / this.props.navigation.state.params.image.width, (Dimensions.get('window').height) * 0.7 / this.props.navigation.state.params.image.height);
        this.state = {
            scale: scale,
            width: this.props.navigation.state.params.image.width * scale,
            height: this.props.navigation.state.params.image.height * scale,
            frame: {x1: 0, x2: this.props.navigation.state.params.image.width * scale, y1: 0, y2:this.props.navigation.state.params.image.height * scale}
        };
        this.setFrame=this.setFrame.bind(this);
    };

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Select points',
            headerRight: <Button onPress={() => navigation.state.params.handleSave()}>Crop selection!</Button>
        };
    };

    savePhoto() {
        ImageEditor.cropImage(this.props.navigation.state.params.image.uri,
            { offset:{x:Math.min(this.state.frame.x1,this.state.frame.x2)/this.state.scale,y:Math.min(this.state.frame.y1,this.state.frame.y2)/this.state.scale},
              size:{width:Math.abs(this.state.frame.x1-this.state.frame.x2)/this.state.scale, height:Math.abs(this.state.frame.y1-this.state.frame.y2)/this.state.scale}},
            (successURI)=> {
                CameraRoll.saveToCameraRoll(successURI)
                    .then(() => {ToastAndroid.show("Success!", ToastAndroid.SHORT);
                        this.props.navigation.state.params.getPhotos();})
                    .catch(() => ToastAndroid.show("Failure!", ToastAndroid.SHORT));

            },
            ()=>{ ToastAndroid.show('Failure!', ToastAndroid.SHORT);}
        );
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleSave: ()=>this.savePhoto() });
    }

    setFrame (x1: number, x2: number, y1: number, y2: number) :void {
        this.setState({
            frame: {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            }
        })
    }

    public render() {
        return (
            <View style={styles.container}>
                <Image source={{uri: this.props.navigation.state.params.image.uri}}
                       style={{
                           position: 'absolute',
                           width: this.state.width,
                           height: this.state.height
                       }}
                       resizeMode='cover'
                />
                <img/>
                <View style={styles.square}><EditionTool width={this.state.width} height={this.state.height} setFrame={this.setFrame}/></View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    square: {
        position: 'absolute',
    }
});