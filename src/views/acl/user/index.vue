<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="用户名" style="margin: 0;">
        <el-input placeholder="请输入用户名" type="text"></el-input>
      </el-form-item>
      <el-form-item style="margin: 0;">
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0;">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button type="danger" plain>批量删除</el-button>

    <el-table style="margin: 10px 0;" border :data="userArr">
      <el-table-column type="selection" width="40px"></el-table-column>
      <el-table-column type="index" width="40px" label="#" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="id" width="80px" align="center" prop="id" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" align="center" width="315px">
        <template #="{ row, $index }">
          <el-button plain type="primary" icon=User>分配角色</el-button>
          <el-button plain type="warning" icon="Edit" @click="editUser(row)">编辑</el-button>
          <el-button plain type="danger" icon="Delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 分页器组件 -->
  <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
    :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
    style="margin: 10px 0; text-align: right" @current-change="getHasUser" @size-change="getHasUser()">
  </el-pagination>

  <!-- 抽屉组件：添加新的用户|更新已有的用户 -->
  <el-drawer v-model="drawer" :title="msg" :size="'40%'">
    <template #default>
      <el-form l abel-width="100px" class="drawer-form" :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input clearable v-model="userParams.username" type="text" placeholder="请填写用户姓名"
            class="input-field"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input clearable v-model="userParams.name" type="text" placeholder="请填写用户昵称"
            class="input-field"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input show-password v-model="userParams.password" type="password" placeholder="请填写用户密码"
            class="input-field"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="footer-buttons">
        <el-button @click="cancel" plain>取消</el-button>
        <el-button type="primary" @click="confirm" plain>确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { reqAddOrUpdateUser, reqAllUser } from '@/api/acl/user';
import { User, UserData } from '@/api/acl/user/type';
import useUserStore from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref } from 'vue';

// 默认一页
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
// 存储用户信息
let userArr = ref<UserData[]>([]);
// 存储用户对象总数
let total = ref<number>(0)
// 控制抽屉组件的显示与隐藏
let drawer = ref<boolean>(false)
// 抽屉组件标题
let msg = ref<string>('')
// 收集用户信息
let userParams = reactive<UserData>({
  id: '',
  username: '',
  name: '',
  password: ''
})
// 获取用户仓库
const userStore = useUserStore();
let curUserName = '';
// 获取form组件实例
let formRef = ref<any>()

// 挂载后获取全部账户信息
onMounted(() => {
  getHasUser()
})

const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: User = await reqAllUser(pageNo.value, pageSize.value);
  if (result.code == 200) {
    userArr.value = result.data.records;
    total.value = result.data.total;
  } else {
    ElMessage({
      type: 'error',
      message: '获取用户信息失败'
    })
  }

}
// 添加新的用户
const addUser = () => {
  removeLastError();
  // 添加新用户前清除之前收集的用户信息
  Object.assign(userParams, {
    id: '',
    username: '',
    name: '',
    password: ''
  })

  msg.value = '添加用户'
  drawer.value = true
}
// 更新用户信息
const editUser = (row: UserData) => {
  removeLastError();
  // 存储选中账号信息
  Object.assign(userParams, row)

  msg.value = '更新用户信息'
  drawer.value = true;
  curUserName = row.username;
}

// 抽屉组件确认按钮回调
const confirm = async () => {
  // 必须保证表单信息复合表单检验规则才能提交
  await formRef.value.validate();
  let result: any = await reqAddOrUpdateUser(userParams);

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功'
    })
    // 关闭抽屉组件
    drawer.value = false
    // 重新获取已有账号信息
    getHasUser(userParams.id ? pageNo.value : 1);

    // 浏览器自动刷新一次
    if (userStore.username == curUserName) {
      window.location.reload();
    }
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败'
    })
    return;
  }
}

const cancel = () => {
  drawer.value = false;
}

// 自定义表单校验规则
// 自定义校验规则，用于检查用户名中是否包含空格
const check_space = (_rule: any, value: any, callback: any) => {
  // _rule: FormItemRule -> 该参数表示当前校验规则对象，但在这个自定义校验中未被使用，因此用下划线命名，表示未使用
  // value: string -> 当前被校验的输入值，在这里是用户名的输入
  // callback: (error?: Error) => void -> 回调函数，用于返回校验结果
  if (value.includes(' ')) {
    // 检查当前输入的用户名中是否包含空格
    // 如果包含空格，则调用 callback 函数并传入一个新的 Error 对象作为参数
    // Error 对象的消息为 '用户名中不能含有空格'
    callback(new Error('不能含有空格'))
  } else {
    // 如果用户名中不包含空格，表示校验通过
    // 调用 callback 函数且不传入参数，表示没有错误
    callback()
  }
}
// 表单校验规则对象
const rules = {
  // 需要校验的字段
  username: [
    { required: true, message: '用户姓名不能为空', trigger: 'blur' },
    { min: 3, max: 15, message: '字数限制在3-15之间', trigger: 'blur' },
    { validator: check_space, trigger: 'blur' },
  ],
  name: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
    { min: 3, max: 15, message: '字数限制在-15之间', trigger: 'blur' },
    { validator: check_space, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码位数在6-15之间', trigger: 'blur' },
    { validator: check_space, trigger: 'blur' }
  ]
}

// 清除上次的错误信息
const removeLastError = () => {
  // 清除上次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate();
  });
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-form {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


.footer-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.footer-buttons el-button {
  margin-left: 10px;
}

.input-field {
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
}
</style>
