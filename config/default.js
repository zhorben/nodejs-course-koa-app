module.exports = {
  port: 3001,
  mongodb: {
    debug: true,
    uri: 'mongodb://localhost/course-chat-app'
  },
  crypto: {
    hash: {
      length: 128,
      iterations: 10
    }
  },
  template: {
    root: `${process.cwd()}/template`
  },
  mailer: {
    user: 'course.test.mailer',
    pass: 'course-test-password2',
    name: 'Sergey Zelenov'
  },
  providers: {
    available: ['vkontakte', 'github', 'facebook'],
    vkontakte: {
      appId: '6726168',
      appSecret: 'vVazHGOUn1NKwTudZbT4',
      callbackURI: 'http://localhost:3000/oauth/vkontakte',
      passportOptions: {
        scope: ['email']
      }
    },
    github: {
      appId: '3a9a925bbaca0c2030bf',
      appSecret: 'b102e903145cfd352c49ef7c089e8e98472b0e43',
      callbackURI: 'http://localhost:3000/oauth/github',
      passportOptions: {
        scope: ['user:email']
      }
    },
    facebook: {
      appId: '1584514044907807',
      appSecret: 'f0f14ef63e0c6b9ec549b9b15f63a808',
      callbackURI: 'http://localhost:3000/oauth/facebook',
      passportOptions: {
        scope: ['email']
      }
    }
  },
};
