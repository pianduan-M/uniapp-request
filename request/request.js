import { mergeConfig } from './mergeConfig'

export class Request {
  defaultConfig = {
    baseUrl: ''
  }
  constructor(config = {}) {
    this.defaultConfig = mergeConfig(this.defaultConfig, config)
  }

  request(config) {

    let requestTask, abort = () => {
      requestTask && requestTask.abort()
    }
    // 合并默认配置
    config = mergeConfig(this.defaultConfig, config)

    // 返回经过 Proxy 后的 Promise 对象使其可以监听到是否调用 abort 和 onProgressUpdate 方法
    return new Proxy(new Promise(async (resolve, reject) => {

      // 请求拦截器
      try {
        config = await this.interceptors.request.intercept(config)
        if (config instanceof Error) {
          throw config
        }
      } catch (error) {
        return this.interceptors.response.intercept(Promise.reject({ config, response: error })).then(resolve, reject)
      }

      let { url, baseUrl = '', method = 'get', ...otherConfig } = config

      requestTask = uni.request({
        ...otherConfig,
        url: url ? url[0] === '/' ? baseUrl + url : url : baseUrl,
        method,
        success: (response) => {
          this.interceptors.response.intercept({ config, response }).then(resolve, reject)
        },
        fail: (response) => {
          this.interceptors.response.intercept(Promise.reject({ config, response })).then(resolve, reject)
        }
      })


    }), {

      get: (target, prop) => {
        if (prop === 'abort') {
          return abort
        } else {
          if (Reflect.get(target, prop) && Reflect.get(target, prop).bind) {
            return Reflect.get(target, prop).bind(target)
          } else {
            return Reflect.get(target, prop)
          }
        }
      }
    })
  }

  file(method, config) {
    let uploadTask, abort = () => {
      uploadTask && uploadTask.abort()
    }
    // 合并默认配置
    config = mergeConfig(this.defaultConfig, config)

    // 返回经过 Proxy 后的 Promise 对象使其可以监听到是否调用 abort 和 onProgressUpdate 方法
    return new Proxy(new Promise(async (resolve, reject) => {

      // 请求拦截器
      try {
        config = await this.interceptors.request.intercept(config)
        if (config instanceof Error) {
          throw config
        }
      } catch (error) {
        return this.interceptors.response.intercept(Promise.reject({ config, response })).then(resolve, reject)
      }

      let { url, baseURL = '', ...otherConfig } = config

      uploadTask = uni[method]({
        ...otherConfig,
        url: url ? url[0] === '/' ? baseURL + url : url : baseURL,
        success: (response) => {
          this.interceptors.response.intercept({ config, response }).then(resolve, reject)
        },
        fail: (response) => {
          this.interceptors.response.intercept(Promise.reject({ config, response })).then(resolve, reject)
        }
      })

    }), {
      get: (target, prop) => {
        switch (prop) {
          case prop = 'abort':
            return abort
          case 'offHeadersReceived':
            return uploadTask.offHeadersReceived
          case 'offProgressUpdate':
            return uploadTask.offProgressUpdate
          case 'offProgressUpdate':
            return uploadTask.offProgressUpdate
          default:
            if (Reflect.get(target, prop) && Reflect.get(target, prop).bind) {
              return Reflect.get(target, prop).bind(target)
            } else {
              return Reflect.get(target, prop)
            }
        }
      },
      set: (target, prop, newVal) => {
        switch (prop) {
          case 'onHeadersReceived':
            return uploadTask.onHeadersReceived = newVal
          case 'onProgressUpdate':
            return uploadTask.onProgressUpdate = newVal
        }

      }
    })
  }

  interceptors = {
    request: {
      interceptors: [],
      use(successFn, errorFn) {
        this.interceptors.push({ successFn, errorFn })
      },
      async intercept(config) {
        const l = this.interceptors.length - 1

        if (l < 0) {
          return config
        }

        for (let i = l; i >= 0; i--) {
          config = Promise.resolve(config).then(this.interceptors[i].successFn, this.interceptors[i].errorFn
          )
        }

        return config
      }
    },
    response: {
      interceptors: [],
      use(successFn, errorFn) {
        this.interceptors.push({ successFn, errorFn })
      },
      async intercept(response) {
        let l = this.interceptors.length - 1

        if (l <= 0) {
          return response
        }
        for (let i = 0; i <= l; i++) {
          // response = Promise.resolve(response).then(this.interceptors[i].successFn, error => Promise.reject(new Error({ error, response }))).then(res => res
          //   , error => {

          //     return this.interceptors[i].errorFn({ error, response })
          //   })

          response = Promise.resolve(response).then(this.interceptors[i].successFn, this.interceptors[i].errorFn,)
        }
        return response
      }
    }
  }
  get(config = {}) {
    config.method = 'GET'
    return this.request(config)
  }
  post(config = {}) {
    config.method = 'POST'
    return this.request(config)
  }
  put(config = {}) {
    config.method = 'PUT'
    return this.request(config)
  }
  delete(config = {}) {
    config.method = 'DELETE'
    return this.request(config)
  }
  connect(config = {}) {
    config.method = 'CONNECT'
    return this.request(config)
  }
  head(config = {}) {
    config.method = 'HEAD'
    return this.request(config)
  }
  options(config = {}) {
    config.method = 'OPTIONS'
    return this.request(config)
  }
  reace(config = {}) {
    config.method = 'REACE'
    return this.request(config)
  }
  uploadFile(config = {}) {
    return this.file('uploadFile', config)
  }
  downloadFile(config = {}) {
    return this.file('downloadFile', config)
  }
}


