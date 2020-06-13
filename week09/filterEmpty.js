const test = {
  'first_name': 'Jane',
  'last_name': 'Smith',
  'email': 'jane.smith@wyng.com',
  'gender': null,
  'invitations': [
    {
      'from': '',
      'code': null
    },
    {
      'from': '66',
      'code': '',
      'first_name': 'Jane',
      'last_name': 'Smith',
      'email': 'jane.smith@wyng.com',
      'gender': null,
      'invitations': [
        {
          'from': '',
          'code': null
        },
        {
          'from': '66',
          'code': ''
        }
      ],
      'first_name': 'Jane',
      'last_name': 'Smith',
      'email': 'jane.smith@wyng.com',
      'gender': null,
      'invitations': [
        {
          'from': '',
          'code': null
        },
        {
          'from': '66',
          'code': ''
        }
      ],
      'first_name': 'Jane',
      'last_name': 'Smith',
      'email': 'jane.smith@wyng.com',
      'gender': null,
      'invitations': [
        {
          'from': '',
          'code': null
        },
        {
          'from': '66',
          'code': '',
          'first_name': 'Jane',
          'last_name': 'Smith',
          'email': 'jane.smith@wyng.com',
          'gender': null,
          'invitations': [
            {
              'from': '',
              'code': null
            },
            {
              'from': '66',
              'code': '',
              'first_name': 'Jane',
              'last_name': 'Smith',
              'email': 'jane.smith@wyng.com',
              'gender': null,
              'invitations': [
                {
                  'from': '',
                  'code': null
                },
                {
                  'from': '66',
                  'code': '',
                  'first_name': 'Jane',
                  'last_name': 'Smith',
                  'email': 'jane.smith@wyng.com',
                  'gender': null,
                  'invitations': [
                    {
                      'from': '',
                      'code': null
                    },
                    {
                      'from': '66',
                      'code': '',
                      'first_name': 'Jane',
                      'last_name': 'Smith',
                      'email': 'jane.smith@wyng.com',
                      'gender': null,
                      'invitations': [
                        {
                          'from': '',
                          'code': null
                        },
                        {
                          'from': '66',
                          'code': '',
                          'first_name': 'Jane',
                          'last_name': 'Smith',
                          'email': 'jane.smith@wyng.com',
                          'gender': null,
                          'invitations': [
                            {
                              'from': '',
                              'code': null
                            },
                            {
                              'from': '66',
                              'code': ''
                            }
                          ],
                        }
                      ],
                    }
                  ],
                }
              ],
            }
          ],
        }
      ],
      'first_name': 'Jane',
      'last_name': 'Smith',
      'email': 'jane.smith@wyng.com',
      'gender': null,
      'invitations': [
        {
          'from': '',
          'code': null
        },
        {
          'from': '66',
          'code': ''
        }
      ]
    }
  ],
  'company': {
    'name': '',
    'industries': []
  },
  'address': {
    'city': 'New York',
    'state': 'NY',
    'zip': '10011',
    'street': '     '
  }
}
function getType(obj){
  const type = Object.prototype.toString.call(obj).slice(8,-1).toLowerCase()
  return {
    isNull: type === 'null',
    isObject: type === 'object',
    isArray: type === 'array',
    isString: type === 'string'
  }
}

function filterEmpty (json) {
  const keys = Object.keys(json)
  keys.forEach(key => {
    const keyType = getType(json[key])
    if(keyType.isNull){
      delete json[key]
      return 
    }
    if(keyType.isObject){
     const ret = filterEmpty(json[key])
      if(!Object.keys(ret).length){
        delete json[key]
      }
      return
    }
    if(keyType.isArray){
      const ret = filterEmpty(json[key])
      json[key] = ret.filter(Boolean)
      if(!json[key].length){
        delete json[key]
      }
      return
    }
    if(keyType.isString){
      if(!json[key].trim()|| !json[key]){
        delete json[key]
        return
      }
    }
  })
  return json
}
console.time()
console.log(
filterEmpty(test)
)
console.timeEnd()