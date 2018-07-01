import React from 'react'
import PropTypes from 'prop-types'
import ConnectionList from '../views/connection-list'
//import Globe from '../views/globe'
import { lookupPretty as getLocation } from 'ipfs-geoip'
import i18n from '../utils/i18n.js'
import { Row, Col } from 'react-bootstrap'
import {withIpfs} from '../components/ipfs'

class Connections extends React.Component {
  constructor (props) {
    super(props)
    //<!--<Globe peers={this.state.peers} />/>
    this.state = {
      peers: [],
      locations: {},
      nonce: 0
    }
  }

  componentDidMount () {
    this.mounted = true
    this.pollInterval = setInterval(() => this.getPeers(), 3000)
    this.getPeers()
  }

  componentWillUnmount () {
    this.mounted = false
    clearInterval(this.pollInterval)
  }

  getPeers () {
    this.props.ipfs.swarm.peers((err, peers) => {
      if (err) {
        console.log("errorororor")
        return console.error(err)
      }
      // If we've unmounted, abort
      if (!this.mounted) {
        return
      }

      peers = peers.sort((a, b) => {
        return a.peer.toB58String() > b.peer.toB58String() ? 1 : -1
      })
      console.log(peers)

      peers.forEach((peer, i) => {
        peer.ipfs = this.props.ipfs
        peer.location = {
          formatted: ''
        }

        let id = peer.peer.toB58String()
        //let location = this.state.locations[id]
        //if (!location) {
        //console.log("getting location")
        this.state.locations[id] = {}
        const addr = peer.addr.toString()
        //getLocation(this.props.ipfs, [addr], (err, res) => {
          //if (err) {
            //return 
            //console.error(err)
          //} 

        // If we've unmounted, abort
        if (!this.mounted) {
          console.log("unmounted")
          return
        } 
        //res = res || {}

        let locations = this.state.locations
        locations[id] = {}
        peers[i] = peer
        console.log("setting state")
        this.setState({
          peers,
          locations,
          nonce: this.state.nonce++
        })
          //})
        //}
      })
    })
  }

  render () {
    return (
      <Row>
        <Col sm={1} className='globe-column'>
         
        </Col>
        <Col sm={6}>
          <h4>{i18n.t('Connected to X peer', { postProcess: 'sprintf', sprintf: [this.state.peers.length], count: this.state.peers.length })}</h4>
          <div>
            <ConnectionList peers={this.state.peers} />
          </div>
        </Col>
      </Row>
    )
  }
}


Connections.displayName = 'Connections'
Connections.propTypes = {
  peers: PropTypes.array,
  ipfs: PropTypes.object
}

export default withIpfs(Connections)
