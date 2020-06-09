import React, { Component } from 'react';
import { View, Item, Input, Text, Button, Icon, Picker } from 'native-base';
import { getProvider } from '../utils/web3.js';
import { addAddress, getAddresses, DEPL_BLOCKS } from '../utils/taylor.js';
import maltay from '@pipeos/taylor';
import { editorOpts } from '../utils/config.js';
import { argsDisplay } from '../utils/taylor_editor.js';

const textStyle = {
  color: 'beige',
  fontSize: editorOpts.fontSize,
  fontFamily: 'monospace',
}

const pickerStyle = {
  backgroundColor: 'rgb(169, 169, 169)',
}

const btniconStyle = { marginLeft: '10px', marginRight: '10px'}

class MalTayContract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      provider: null,
      signer: null,
      rootAddress: {},
      addresses: {},
      rootFunctions: [],
      addrToBeRegistered: null,
      registered: {},
      backend: 'injected',
    }

    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeCurrentName = this.onChangeCurrentName.bind(this);
    this.onAddressSave = this.onAddressSave.bind(this);
    this.onChangeRootAddress = this.onChangeRootAddress.bind(this);
    this.onChangeRegisteredAddress = this.onChangeRegisteredAddress.bind(this);
    this.onRegister = this.onRegister.bind(this);
    this.onChangeBackend = this.onChangeBackend.bind(this);
  
    this.setWeb3();
  }

  async setWeb3() {
    const { provider, signer } = await getProvider();
    if (!provider) {
      this.setState({ backend: 'javascript' })
      this.props.onRootChange('javascript', this.web3util, maltay.malBackend.getBackend());
      return;
    }
    const chainid = (await provider.getNetwork()).chainId;
    const addresses = getAddresses(chainid);
    const rootAddress = {name: addresses.root, address: addresses[addresses.root]};
    this.setState({ addresses, rootAddress, provider, signer });
    
    this._web3util = maltay.getTaylor(provider, signer);
    this.setContract(rootAddress.address);
    this.setRegistered(rootAddress.address);
  }

  setContract(address) {
    const { backend } = this.state;
    address = address || this.state.rootAddress;
    if(!address && backend !== 'javascript') {
        this.web3util = null;
    } else {
      this.web3util = this._web3util(address);
      this.props.onRootChange(backend, this.web3util, maltay.malBackend.getBackend());

      this.setFunctions(address);
    }
  }

  async setRegistered(address) {
    address = address || this.state.rootAddress.address;
    if (!address) return;

    let count = await this.web3util.call_raw('0x44444440');
    count = parseInt(count, 16);
    let registered = {};

    for (let i = 1; i <= count; i++) {
      const expr = maltay.expr2h('(getregistered ' + i + ')');
      let raddr = await this.web3util.call_raw(expr);
      raddr = '0x' + raddr.substring(10);
      registered[raddr] = raddr;
    }
    this.setState({ registered });
  }

  async setFunctions(address) {
    address = address || this.state.rootAddress.address;
    if (!address) return;

    let logs = await this.web3util.getFns({
      fromBlock: DEPL_BLOCKS[this.state.provider._network.chainId] || 0,
    });
    let rootFunctions = logs.map(log => '(' + log.name + ' ... )')
      .concat(Object.keys(maltay.nativeEnv).map(name => {
        return '(' + name + ' ' + argsDisplay(maltay.nativeEnv[name]) + ')';
      }));
    this.setState({ rootFunctions });
  }

  async onChangeAddress(address) {
    const { rootAddress } = this.state;
    rootAddress.address = address;
    this.setState({ rootAddress });
  }

  onChangeCurrentName(name) {
    const { rootAddress } = this.state;
    rootAddress.name = name;
    this.setState({ rootAddress });
  }

  onChangeBackend(backend) {
    if (backend !== 'javascript' && !this.state.provider) {
      this.setWeb3();
      return;
    }
    
    this.setState({ backend });
    this.props.onRootChange(backend, this.web3util, maltay.malBackend.getBackend());
  }

  async onAddressSave() {
    const { rootAddress } = this.state;
    const { provider  } = this.state;
    const chainid = (await provider.getNetwork()).chainId;

    addAddress(chainid, rootAddress.address, rootAddress.name);
    this.setContract(rootAddress.address);
    this.setRegistered(rootAddress);
  }

  onChangeRootAddress(newaddress) {
    const { addresses } = this.state;
    const name = Object.keys(addresses).find(name => addresses[name] === newaddress) || newaddress;

    const rootAddress = { name, address: newaddress};
    if (!addresses[name]) {
      addresses[name] = newaddress;
      this.setState({ addresses });
    }
    this.setState({ rootAddress });
    this.setContract(rootAddress.address);
    this.setRegistered(newaddress);
  }

  onChangeRegisteredAddress(newval) {
    this.setState({ addrToBeRegistered: newval });
  }

  async onRegister() {
    const { addrToBeRegistered } = this.state;
    
    const expr = maltay.expr2h('(register! 0x"' + addrToBeRegistered.substring(2) + '")');
    await this.web3util.send(expr);

    // TODO check receipt for success;
    this.setRegistered();
  }

  render() {
    const {styles} = this.props;
    styles.width -= 10;
    const { rootAddress, addresses, registered, rootFunctions } = this.state;

    const addrs = Object.assign({}, addresses);
    delete addrs.root;
    const rootOptions = Object.keys(addrs)
      .map(name => {
        return <Picker.Item label={name} value={addresses[name]} key={name}/>
      })

    return (
      <View style={{ ...styles, flex: 1 }}>
          <Button small light
            style={{ position: 'fixed', top: '10px', right: '26px' }}
            onClick={() => window.open('https://github.com/loredanacirstea/taylor', '_blank')}
          >
            <Icon name='info' type="FontAwesome" style={btniconStyle} />
          </Button>
          
          <Text style={textStyle}>select backend:</Text>
          <Item picker style={{ borderColor: false, marginRight: '60px' }}>
            <Picker
              mode="dropdown"
              style={{ width: styles.width, ...pickerStyle }}
              selectedValue={this.state.backend}
              onValueChange={this.onChangeBackend}
            >
              <Picker.Item label="javascript" value="javascript" key="javascript"/>
              <Picker.Item label="injected web3 provider" value="injected" key="injected"/>
              <Picker.Item label="both" value="both" key="both"/>
            </Picker>
          </Item>
          
          <br></br><br></br>
          <Text style={textStyle}>select root Taylor contract:</Text>
          <Item picker style={{ borderColor: false}}>
            <Picker
              mode="dropdown"
              style={{ width: styles.width, ...pickerStyle }}
              selectedValue={this.state.rootAddress.name}
              onValueChange={this.onChangeRootAddress}
            >
              { rootOptions }
            </Picker>
          </Item>

          <br></br><br></br>
          <Text style={textStyle}>@root address:</Text>
          <Text style={{...textStyle, fontWeight: 'bold', fontSize: textStyle.fontSize + 2}}>{ rootAddress.address || '-' }</Text>
          <br></br>
          <Text style={textStyle}>registered contracts @root:</Text>

          <Item picker style={{ borderColor: false}}>
            <Picker
              mode="dropdown"
              style={{ width: styles.width, ...pickerStyle }}
              selectedValue={this.state.rootAddress.name}
              onValueChange={this.onChangeRootAddress}
            >
              <Picker.Item label="..." value={''} />
              {
                Object.keys(registered).map(name => {
                  return <Picker.Item label={name} value={addresses[name]} key={name}/>
                })
              }
            </Picker>
          </Item>

          <br></br><br></br>
          <Text style={textStyle}>@root functions:</Text>
          
          <Item picker style={{ borderColor: false}}>
            <Picker
              mode="dropdown"
              style={{ width: styles.width, ...pickerStyle }}
            >
              <Picker.Item label="..." value={''} />
              {
                rootFunctions.map((name, i) => {
                  return <Picker.Item label={name} value={name} key={i}/>
                })
              }
            </Picker>
          </Item>

          <br></br><br></br>
          <Text style={textStyle}>register a Taylor contract @root:</Text>
          <Item style={{ width: styles.width }}>
            <Input
              style={textStyle}
              placeholder='address'
              label='address'
              onChangeText={this.onChangeRegisteredAddress}
            />
            <Button small light onClick={this.onRegister}>
              <Icon name='save' style={btniconStyle} />
            </Button>
          </Item>

          <br></br><br></br>
        </View>
    );
  }
}

export default MalTayContract;

//           <br></br><br></br><br></br>
//           <Text style={textStyle}>declare another Taylor root:</Text>
//           <Item style={{ width: styles.width }}>
//             <Input
//               style={textStyle}
//               placeholder='address'
//               label='address'
//               onChangeText={this.onChangeAddress}
//             />
//           </Item>
//           <Item style={{ width: styles.width, marginBottom: 5 }}>
//             <Input
//               style={textStyle}
//               placeholder='name'
//               label='name'
//               onChangeText={this.onChangeCurrentName}
//             />
//             <Button small light onClick={this.onAddressSave}>
//               <Icon name='save' />
//             </Button>
//           </Item>
