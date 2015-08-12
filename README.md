[![Stories in Ready](https://badge.waffle.io/gitpay/util.png?label=ready&title=Ready)](https://waffle.io/gitpay/util)

[![Join the chat at https://gitter.im/gitpay/util](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gitpay/util?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# gitpay

gitpay is an experimental set of tools for creating incentives within free and open source projects

please review our code of conduct before participating in this project

* https://github.com/gitpay/code-of-conduct

# installation

    npm install -g gitpay

# util

util is a set of command line tooling and helper functions enable the core features

# commands

preface with : git pay <command>

    btc <nick>                   - get bitcoin and testnet address
    code                         - shows gitpay code of conduct
    decrypt <message> <key>      - decrypt message with key file
    encrypt <message> <key>      - encrypt message with key uri
    help                         - shows help message
    id <nick>                    - shows nick details in turtle
    keys <nick>                  - get uris of keys for a nick
    me <nick>                    - saves your identity for convenience
    nick <nick>                  - saves your nick for convenience
    pubkey <key>                 - saves your pub key URI for convenience
    privkey <key>                - saves your priv key file for convenience
    sign <message> <key>         - sign message with key file
    verify <message> <sig> <key> - verify a signature with key file and message
    version                      - shows version number


# examples

## encrypt

    git pay encrypt "gitpay"
    jWN9C6Rj/i5jQh1JaohfOEsXkDHy+9j+jKuajAnVmfMh9As4XxvWM9Bd6T277EX1vZB80gq9otqintB8TG7GYTJ8NuGnMGJQlRWYLllIHaD6Jnv5UW1qf5HtvQ1wRQzeI2+MHccXB3xD3qc0FlGLbF22cGe79CHPFBRW2U7ij7ikGZK8iaAUr79o1PR6g0B6fuw44DGBJISqLwmiBbbYhSCHqfih/hkFv5gB1gSWA9rZ0+vmyMr5+fOPgM1AblljujaqAWXRdoNvzyVF0mwiq1NUAtsedxIg+TEBMQO+6gE7IXk90ZneaaCIgBOvzothBy36J9QJfGgoa3EMqqeG4g==

## decrypt

    git pay decrypt  jWN9C6Rj/i5jQh1JaohfOEsXkDHy+9j+jKuajAnVmfMh9As4XxvWM9Bd6T277EX1vZB80gq9otqintB8TG7GYTJ8NuGnMGJQlRWYLllIHaD6Jnv5UW1qf5HtvQ1wRQzeI2+MHccXB3xD3qc0FlGLbF22cGe79CHPFBRW2U7ij7ikGZK8iaAUr79o1PR6g0B6fuw44DGBJISqLwmiBbbYhSCHqfih/hkFv5gB1gSWA9rZ0+vmyMr5+fOPgM1AblljujaqAWXRdoNvzyVF0mwiq1NUAtsedxIg+TEBMQO+6gE7IXk90ZneaaCIgBOvzothBy36J9QJfGgoa3EMqqeG4g==
    gitpay

## sign

    git pay sign gitpay
    p+COR37L4odjO4zO58OcHWF+HmZZx5qwemB6xvOl2s1sys46RjvdUaIG+TXmWXZy1G6G5gVcARI12q1oDJ0iqOPX3GkEnV69iycvTNZClnDwoPyMG7RnT7wk7jTZluWmHKxb/2kBpGRIFo+AWGFeawe5QSCWSsXbZCd5TAGjgLbNhO7BAET7HxXF19X6QbyMWF6W97O6sKBaG72vFvRXBqb9gKIYuNPJz7GR0mWtI/KeGDdLi5QWqjFCnsj6FUgnAQuQQeP8M2+OlWbaVTAM72zP0jIqtOEMPy3+M9FTgj3hpDwUFiUBnmTzbP6YFNxasia5srDDPRLlP9oxoH0kZA==

## verify

    git pay verify gitpay p+COR37L4odjO4zO58OcHWF+HmZZx5qwemB6xvOl2s1sys46RjvdUaIG+TXmWXZy1G6G5gVcARI12q1oDJ0iqOPX3GkEnV69iycvTNZClnDwoPyMG7RnT7wk7jTZluWmHKxb/2kBpGRIFo+AWGFeawe5QSCWSsXbZCd5TAGjgLbNhO7BAET7HxXF19X6QbyMWF6W97O6sKBaG72vFvRXBqb9gKIYuNPJz7GR0mWtI/KeGDdLi5QWqjFCnsj6FUgnAQuQQeP8M2+OlWbaVTAM72zP0jIqtOEMPy3+M9FTgj3hpDwUFiUBnmTzbP6YFNxasia5srDDPRLlP9oxoH0kZA==
    true

# git pay utils

Utils for dealing with PKI

* get public key from openssh
* get private key from openssh
* convert openssh keys to x.509 certifiate
* generate webid tls certificates
