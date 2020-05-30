import React, { Component } from 'react';
import { Dimensions, StyleSheet, ScrollView } from 'react-native';
import { View, Button, Icon } from 'native-base';
import MonacoEditor from 'react-monaco-editor';
import { editorOpts } from '../utils/config.js';
import Out from '../components/Out.js';
import { getProvider } from '../utils/web3.js';
import MalTayContract from '../components/MalTayContract.js';
import * as taylorUtils from '../utils/taylor.js';
import maltay from 'taylor/maltay/maltay.js';

console.log('maltay', maltay);

const MalTayAddress = '0x5469b58d296a04e1f38e849a6970eaecaaca3c18';

// ropsten
// const MalTayAddress = '0xbB8a87C53811Da984a1d716936fB3e2B9A3Ce45e';

// goerli
// const MalTayAddress = '0x172Bf95cf3fdd2d5B4C69c315fe517f08D868F65';

const call = provider => address => async data => {
    let transaction = {
      to: address,
      data
    }
    return await provider.call(transaction);
  }

const sendTransaction = signer => address => async data => {
    const transaction = {
      data,
      gasLimit: 1000000,
      value: 0,
      to: address,
      gasPrice: 21,
    };
    const response = await signer.sendTransaction(transaction);
    return response;
  }


const MIN_WIDTH = 800;

function getPageSize(noOfPages, {width, height}) {
  // console.log('--dimensions', noOfPages, {width, height});
  if (width < MIN_WIDTH) return {minWidth: width, minHeight: height};

  return {width: width / noOfPages, height};
}

class Taylor2 extends Component {
  constructor(props) {
    super(props);

    const code =  taylorUtils.getCode();
    const encoded = maltay.expr2h(code);

    this.state = {
      ...this.getWindowDimensions(),
      pageNumber: 3,
      autocompile: true,
      code,
      encoded,
      result: [{data: encoded}],
      errors: '',
      provider: null,
      signer: null,
    }

    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.getWindowDimensions = this.getWindowDimensions.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.execute = this.execute.bind(this);

    this.setWeb3();
  }

  async setWeb3() {
    const { provider, signer } = await getProvider();
    const chainid = (await provider.getNetwork()).chainId;
    this.setState({ provider, signer });

    this.taycall = call(provider)(MalTayAddress);
    this.taysend = sendTransaction(signer)(MalTayAddress);
    this.execute();
  }

  async execute({encdata, code, force=false}={}) {
      encdata = encdata || this.state.encoded;
      code = code || this.state.code;
      const isTransaction = code && code.includes("def!");
      if (!isTransaction) {
        let encoded;
        try {
            encoded = await this.taycall(encdata);
        } catch (e) {}
        let result;
        try {
            result = maltay.decode(encoded);
        } catch(e) {}
        this.setState({ result: [{ result, encoded, data: encdata }] });
      } else if (force) {
          let response, receipt = {};
          try {
            response = await this.taysend(encdata);
            this.setState({ result: [{ receipt: response }] });
            receipt = await response.wait();
          } catch (e) {}
        
        if (receipt.status === 0) {
            throw new Error('Transaction failed');
        }
        this.setState({ result: [{ receipt }] });

      }
  }

  onContentSizeChange() {
    this.setState(this.getWindowDimensions());
  }

  getWindowDimensions() {
    let wdims = Dimensions.get('window');
    let rootDims = document.getElementById('TaylorRoot').getBoundingClientRect();

    const dims = {
      width: wdims.width || rootDims.width,
      height: wdims.height || rootDims.height,
    }
    return dims;
  }

  editorDidMount(editor, monaco) {
    editor.focus();
  }

  onTextChange(code) {
      try {
        const encoded = maltay.expr2h(code);
        this.setState({ code });
        taylorUtils.storeCode(code);
        this.execute({encdata: encoded, code});
      } catch(e) {}
  }

  render() {
    let {
      width,
      height,
    } = this.state;
    const styles = getPageSize(this.state.pageNumber, { width, height });

    const editorStyles = { ...styles, width: styles.width * 2, height: styles.height * 2 / 5 }
    const consoleStyles = { ...styles, width: styles.width * 2, height: styles.height - editorStyles.height }
    const panelStyles = { ...styles }

    const {code, result, errors} = this.state;

    return (
        <ScrollView
            horizontal={true}
            pagingEnabled={true}
            scrollEnabled={true}
            scrollEventThrottle={100}
            nestedScrollEnabled={true}
            contentContainerStyle={{width: "100%"}}
            onContentSizeChange={this.onContentSizeChange}
        >
            <View style={{ ...editorStyles, flex: 1}}>
                <MonacoEditor
                    width={editorStyles.width}
                    height={editorStyles.height}
                    language="javascript"
                    theme="vs-dark"
                    value={code}
                    options={editorOpts}
                    onChange={this.onTextChange}
                    editorDidMount={this.editorDidMount}
                />
                <Out 
                    result={result}
                    errors={errors}
                    styles={{ ...consoleStyles }}
                />
            </View>
            <Button
                small
                light
                style={{ position: 'fixed', top: '0px', left: '0px', backgroundColor: 'white',  opacity: this.state.autocompile ? 0.5 : 0.2 }}
                onClick={() => this.execute({force: true})}
            >
                <Icon type="FontAwesome" name='play' />
            </Button>
            <MalTayContract
                currentGraph={null}
                styles={{...panelStyles}}
            />
        </ScrollView>
    );
  }
}

export default Taylor2;
