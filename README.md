[![Stories in Ready](https://badge.waffle.io/gitpay/util.png?label=ready&title=Ready)](https://waffle.io/gitpay/util)

# util


[![Join the chat at https://gitter.im/gitpay/util](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gitpay/util?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# commands

    btc <login>                   - get bitcoin and testnet address
    code                          - shows gitpay code of conduct
    decrypt <key> <message>       - decrypt message with key file
    encrypt <key> <message>       - encrypt message with key uri
    help                          - shows help message
    id <login>                    - shows login details in turtle
    keys <login>                  - get uris of keys for a login
    sign <key> <message>          - sign message with key file
    verify <key> <message>  <sig> - verify a signature with key file and message
    version                       - shows version number


# git pay utils

Utils for dealing with PKI

* get public key from openssh
* get private key from openssh
* convert openssh keys to x.509 certifiate
* generate webid tls certificates
