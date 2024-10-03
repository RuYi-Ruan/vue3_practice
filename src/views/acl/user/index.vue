<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="用户名" style="margin: 0">
        <el-input
          placeholder="请输入用户名"
          type="text"
          v-model="keyword"
        ></el-input>
      </el-form-item>
      <el-form-item style="margin: 0">
        <el-button
          type="primary"
          :disabled="keyword.length > 0 ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button
      type="danger"
      plain
      @click="deleteSelectUser"
      :disabled="selectUserArr.length > 0 ? false : true"
    >
      批量删除
    </el-button>

    <el-table
      style="margin: 10px 0"
      border
      :data="userArr"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" width="40px"></el-table-column>
      <el-table-column
        type="index"
        width="40px"
        label="#"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="id"
        width="80px"
        align="center"
        prop="id"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" align="center" width="315px">
        <template #="{ row, $index }">
          <el-button plain type="primary" icon="User" @click="assignRoles(row)">
            分配角色
          </el-button>
          <el-button plain type="warning" icon="Edit" @click="editUser(row)">
            编辑
          </el-button>
          <el-popconfirm
            width="220"
            icon="InfoFilled"
            icon-color="#626AEF"
            title="Are you sure to delete this?"
            @confirm="deleteSingleUser(row.id)"
          >
            <template #reference>
              <el-button plain type="danger" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 分页器组件 -->
  <el-pagination
    v-model:current-page="pageNo"
    v-model:page-size="pageSize"
    :page-sizes="[3, 5, 7, 9]"
    :background="true"
    layout="prev, pager, next, jumper, ->, total, sizes"
    :total="total"
    style="margin: 10px 0; text-align: right"
    @current-change="getHasUser"
    @size-change="getHasUser()"
  ></el-pagination>

  <!-- 抽屉组件：添加新的用户|更新已有的用户 -->
  <el-drawer v-model="drawer" :title="msg" :size="'40%'">
    <template #default>
      <el-form
        l
        abel-width="100px"
        class="drawer-form"
        :model="userParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="用户姓名" prop="username">
          <el-input
            clearable
            v-model="userParams.username"
            type="text"
            placeholder="请填写用户姓名"
            class="input-field"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            clearable
            v-model="userParams.name"
            type="text"
            placeholder="请填写用户昵称"
            class="input-field"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            show-password
            v-model="userParams.password"
            type="password"
            placeholder="请填写用户密码"
            class="input-field"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="footer-buttons">
        <el-button @click="cancel" plain>取消</el-button>
        <el-button type="primary" @click="addOrUpdateConfirm" plain>
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉组件：为账号分配角色 -->
  <el-drawer v-model="drawer1" title="分配角色">
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input
            type="text"
            disabled
            v-model="userParams.username"
          ></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox
            value=""
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="hasRoles"
            @change="handleCheckedRolesChange"
          >
            <el-checkbox
              v-for="role in allRoles"
              :key="role.id"
              :label="role.roleName"
              :value="role.roleName"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <div style="flex: auto">
        <el-button plain @click="drawer1 = false">取消</el-button>
        <el-button type="primary" plain @click="assignRolesConfirm">
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateUser,
  reqAllUser,
  reqAssignRole,
  reqDeleteMoreUser,
  reqDeleteSingleUser,
  reqGetAllRoles,
} from '@/api/acl/user'
import {
  AssignRoleData,
  Role,
  RoleData,
  User,
  UserData,
} from '@/api/acl/user/type'
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { CheckboxValueType, ElMessage } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'

// 默认一页
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
// 存储用户信息
let userArr = ref<UserData[]>([])
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
  password: '',
})
// 获取用户仓库
const userStore = useUserStore()
let curUserName = ''
// 获取form组件实例
let formRef = ref<any>()
// 控制分配角色抽屉组件的显示与隐藏
let drawer1 = ref<boolean>(false)
// 全选复选框绑定值
let checkAll = ref<boolean>(false)
// 设置不确定状态，负责样式控制
let isIndeterminate = ref<boolean>(true)
// 所有角色
const allRoles = ref<RoleData[]>([])
// 用户已有角色
const userRole = ref<RoleData[]>([])
// 用户已有角色名字
const hasRoles = ref<string[]>([])
// 存储批量删除用户的id
let selectUserArr = ref<UserData[]>([])
// 存储选中的用户 ID
let selectedIds = ref<number[]>([])
// 收集搜索框用户输入的关键字
let keyword = ref<string>('')
// 获取setting仓库
let settingStore = useLayoutSettingStore()

// 挂载后获取全部账户信息
onMounted(() => {
  getHasUser()
})

const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: User = await reqAllUser(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    userArr.value = result.data.records
    total.value = result.data.total
    syncSelection() // 在获取数据后同步选择状态
  } else {
    ElMessage({
      type: 'error',
      message: '获取用户信息失败',
    })
  }
}
// 添加新的用户
const addUser = () => {
  removeLastError()
  // 添加新用户前清除之前收集的用户信息
  Object.assign(userParams, {
    id: '',
    username: '',
    name: '',
    password: '',
  })

  msg.value = '添加用户'
  drawer.value = true
}
// 更新用户信息
const editUser = (row: UserData) => {
  removeLastError()
  // 存储选中账号信息
  Object.assign(userParams, row)

  msg.value = '更新用户信息'
  drawer.value = true
  curUserName = row.username
}

// 抽屉组件: 添加|更新账号信息 确认按钮回调
const addOrUpdateConfirm = async () => {
  // 必须保证表单信息复合表单检验规则才能提交
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateUser(userParams)

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // 关闭抽屉组件
    drawer.value = false
    // 重新获取已有账号信息
    getHasUser(userParams.id ? pageNo.value : 1)

    // 浏览器自动刷新一次
    if (userStore.username == curUserName) {
      window.location.reload()
    }
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
    return
  }
}

const cancel = () => {
  drawer.value = false
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
    { validator: check_space, trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码位数在6-15之间', trigger: 'blur' },
    { validator: check_space, trigger: 'blur' },
  ],
}

// 清除上次的错误信息
const removeLastError = () => {
  // 清除上次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

// 分配角色按钮回调
const assignRoles = async (row: UserData) => {
  // 存储已有用户信息
  Object.assign(userParams, row)

  // 获取全部职位数据与当前用户已有的职位数据
  let result: Role = await reqGetAllRoles(userParams.id as number)
  if (result.code == 200) {
    allRoles.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    extractRoleNames()
    drawer1.value = true
    isIndeterminate.value = allRoles.value.length > userRole.value.length
    checkAll.value = allRoles.value.length == userRole.value.length
  }
}

// 复选框改变事件回调
const handleCheckAllChange = (val: CheckboxValueType) => {
  const isChecked = val as boolean
  userRole.value = isChecked ? allRoles.value : []
  extractRoleNames()
  isIndeterminate.value = false
}

// 角色复选框改变事件回调
const handleCheckedRolesChange = (value: CheckboxValueType[]) => {
  const roles = value as string[]
  const checkedCount = roles.length
  checkAll.value = checkedCount === allRoles.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length
}

// 提取已有角色名称
const extractRoleNames = () => {
  hasRoles.value = userRole.value.map((role: RoleData) => role.roleName)
}

// 分配角色抽屉组件确认按钮回调
const assignRolesConfirm = async () => {
  // 更新选择的职位信息，根据 hasRoles 匹配 allRoles 中对应的角色，并更新 userRole
  userRole.value = allRoles.value.filter((role) =>
    hasRoles.value.includes(role.roleName),
  )
  // 收集参数
  let data: AssignRoleData = {
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
    userId: userParams.id as number,
  }
  // 分配用户职位请求
  let result: any = await reqAssignRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配成功',
    })
    drawer1.value = false
    // 重新获取全部账户信息
    getHasUser(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配失败',
    })
    return
  }
}

// 删除单个用户
const deleteSingleUser = async (id: number) => {
  const result = await reqDeleteSingleUser(id)
  if (result.code === 200) {
    ElMessage.success('删除成功')
    getHasUser()
    selectedIds.value = selectedIds.value.filter((itemId) => itemId !== id) // 添加这行，删除后更新选中的 ID
  } else {
    ElMessage.error('删除失败')
  }
}

// table复选框勾选时触发的事件
const selectChange = (selectedRows: UserData[]) => {
  selectedIds.value = selectedRows.map((user) => {
    return user.id as number
  }) // 更新已选择的用户 ID
  selectUserArr.value = [...new Set([...selectUserArr.value, ...selectedRows])] // 合并选择的用户
}

// 批量删除按钮回调
const deleteSelectUser = async () => {
  let idList: number[] = selectUserArr.value.map((item) => {
    return item.id as number
  })

  // 删除请求
  let result: any = await reqDeleteMoreUser(idList)
  console.log(idList)

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 重新获取已有用户
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

const syncSelection = () => {
  userArr.value.forEach((user) => {
    if (selectedIds.value.includes(user.id as number)) {
      selectUserArr.value.push(user)
    }
  })
}

// 搜索按钮回调
const search = () => {
  // 根据关键字获取查询列表
  getHasUser()
  // 清空关键字
  keyword.value = ''
}

// 重置按钮回调
const reset = () => {
  // settingStore.refresh = !settingStore.refresh;
  // 重新发一次请求也行
  getHasUser()
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
