import { isPromise } from 'src/utils/utils'
import { Application, AppStatus } from '../types'

export default function mountApp(app: Application): Promise<any> {
    // 将应用程序状态改为挂载前
    app.status = AppStatus.BEFORE_MOUNT
    //
    let result = (app as any).mount(app.props)
    if (!isPromise(result)) {
        result = Promise.resolve(result)
    }
    // 转换为Promise函数为了调用后能够改变应用状态
    // 将应用程序状态改为挂载中
    return result
    .then(() => {
        app.status = AppStatus.MOUNTED
    })
    .catch((err: Error) => {
        app.status = AppStatus.MOUNT_ERROR
        throw err
    })
}
