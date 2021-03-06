module.exports.name = 'producers-curlProducer'
module.exports.dependencies = ['stringHelper']
module.exports.factory = (stringHelper) => {
  'use strict'

  const BEGIN = '```bash\n'
  const TEMPLATE = 'curl -X {{method}} "{{url}}"'
  const HEADER = ' -H "{{key}}: {{value}}"'
  const BODY = ' -d \'{{body}}\''
  const END = '\n```\n\n'

  return new Producer()

  function Producer () {
    var self = {
      produce: produce
    }

    function produce (config, callback) {
      var output = TEMPLATE
        .replace(/{{method}}/, stringHelper.getMethod(config.method))
        .replace(/{{url}}/, stringHelper.getUrl(config))

      output += getHeaders(config.headers)
      output += getBody(config.body)

      callback(null, BEGIN + output + END)
    }

    function getHeaders (headers) {
      var output = ''
      var key

      if (!headers) {
        return output
      }

      for (key in headers) {
        if (headers.hasOwnProperty(key)) {
          output += HEADER
            .replace(/{{key}}/, key)
            .replace(/{{value}}/, headers[key])
        }
      }

      return output
    }

    function getBody (body) {
      if (!body) {
        return ''
      }

      return BODY.replace(/{{body}}/, stringHelper.replaceSingleQuotes(body))
    }

    return self
  }
}
