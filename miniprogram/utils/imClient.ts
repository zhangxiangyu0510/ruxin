import TIM from 'tim-wx-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
import { EventBusInstance } from '../utils/eventBus';

const options = {
    //如新线上环境
    // SDKAppID: 1400686532
    //如新测试环境
    SDKAppID: 1400661803
    //本地环境
    // SDKAppID: 1400631764
};
const tim = TIM.create(options);
tim.setLogLevel(0);
tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
wx.$TUIKit = tim;
wx.$TUIKitTIM = TIM;
wx.$TUIKitEvent = TIM.EVENT
wx.$TUIKitVersion = TIM.VERSION
wx.$TUIKitTypes = TIM.TYPES

const sdkReady = (event: any) => {
    console.log('ready')
}
const messageReceived = (event: any) => {
    console.log('message received', event)

    const payload = event.data[0].payload.text
    console.log('messagePayload', payload)

    EventBusInstance.emit('notification', JSON.parse(payload))
}


class ImClient {
    connected: boolean;
    tim: any;
    constructor(tim: any) {
        this.connected = false
        this.tim = tim
    }

    connect(loginInfo: any) {
        this.tim.on(TIM.EVENT.SDK_READY, sdkReady)
        this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, messageReceived)

        this.tim.login(loginInfo);
        this.connected = true
    }
    disconnect() {
        this.tim.logout();
        this.connected = false;
    }
    on(eventName: any, event: any) {
        this.tim.on(eventName, event);
    }
    off(eventName: any, event: any) {
        this.tim.off(eventName, event)
    }
}

const imClinet = new ImClient(tim);

export default imClinet
