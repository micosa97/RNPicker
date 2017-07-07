import * as React from 'react';
import { View, StyleSheet, CameraRoll, ScrollView, Image, Dimensions, TouchableHighlight, ToastAndroid } from 'react-native';

interface Props {
    navigation: any //TODO! not sure if I should specify types
}

interface State {
    photos: any[]; // TODO! not sure if I should specify types
    width: number;
    index: number;
}

export default class Selector extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            width: Dimensions.get('window').width,
            index: null
        };
        this.getPhotos=this.getPhotos.bind(this);
    }

    static navigationOptions = {
        title: 'select photo',
    };

    componentWillMount(){
        this.getPhotos();
    }

    setIndex = (index) => {
        if (index === this.state.index)
            index = null;
        else
            ToastAndroid.show('Press again to edit!', ToastAndroid.SHORT);
        this.setState({index});
    };

    getPhotos = () => {
        CameraRoll.getPhotos({
            first: 30,
            assetType: 'All'
        }).then(r => this.setState({photos: r.edges}))
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    {
                        this.state.photos.map((image: any, i: number) => {
                            return (
                                <TouchableHighlight
                                    style={{opacity: i === this.state.index ? 0.5 : 1}}
                                    key={i}
                                    underlayColor='transparent'
                                    onPress={() => {
                                        this.setIndex(i);
                                        if (i === this.state.index) {
                                            this.props.navigation.navigate("Editor", {image: image.node.image, getPhotos: this.getPhotos});
                                        }
                                    }}>

                                    <Image key={`image ` + i.toString()}
                                           style={{
                                               width: this.state.width / 3,
                                               height: this.state.width / 3
                                           }}
                                           source={{uri: image.node.image.uri}}
                                    />
                                </TouchableHighlight>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF'
    },
    scrollView: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
});