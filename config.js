import merge from 'lodash.merge'

const environment = process.env.PROJECT_ENV || 'local'

const config = {
  version: '0.1',
  environment,
  endpoint: {
    backend: 'https://dtm-api.avalue.co.th/api'
  },
  authentication: {
    storageName: 'POS-HI-SUSHI'
  }
}

const runtimeConfig = {
  endpoint: {
    backend: process.env.ENDPOINT_BACKEND
  }
}

const environmentConfig = {
  local: {
    endpoint: {
      backend: 'https://dtm-api.avalue.co.th/api'
    }
  },
  development: {
    endpoint: {
      backend: 'https://dtm-api.avalue.co.th/api'
    }
  },
  production: {
    endpoint: {
      backend: 'https://dtm-api.avalue.co.th/api'
    }
  }
}

const mergeConfig = (baseConfig, replaceConfig) => {
  // eslint-disable-next-line array-callback-return
  Object.keys(baseConfig).map((key) => {
    if (replaceConfig[key] !== undefined) {
      if (baseConfig[key] instanceof Object) {
        baseConfig[key] = merge(baseConfig[key], replaceConfig[key])
      } else {
        baseConfig[key] = replaceConfig[key]
      }
    }
  })
}

mergeConfig(config, environmentConfig[environment])
mergeConfig(config, runtimeConfig)

export default config
