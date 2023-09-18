import { Application, AppStatus } from '../types'
import { apps } from './apps'

/**
 * 该方法用来注册新的应用程序,并将应用程序的状态改为BEFORE_BOOTSTRAP(初始化状态)
 * @param app 所注册的应用
 */
export default function registerApplication(app: Application) {
    console.log('app registerApplication', app)
  
    if (typeof app.activeRule === 'string') {
        const path = app.activeRule
        /**
     * 并且判断activeRule是否为字符串,如果 app.activeRule 是一个字符串，
     * 代码将它赋值给一个新的函数 app.activeRule，这个函数会接受一个 location 参数
     * （默认为 window.location），并检查当前页面的路径是否与传入的路径匹配。
     * 这是为了将路径规则转换为一个可执行的条件函数。
     * @param location 地址
     * @returns
     */
        app.activeRule = (location = window.location) => location.pathname === path
    }

    app.status = AppStatus.BEFORE_BOOTSTRAP
    apps.push(app)
}
