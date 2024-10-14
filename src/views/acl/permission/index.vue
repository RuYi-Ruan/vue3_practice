<template>
  <el-table
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    default-expand-all
    :data="permissionArr"
  >
    <el-table-column align="center" label="名称" prop="name"></el-table-column>
    <el-table-column
      align="center"
      label="权限值"
      prop="code"
    ></el-table-column>
    <el-table-column
      align="center"
      label="修改时间"
      prop="updateTime"
    ></el-table-column>
    <el-table-column align="center" label="操作" width="360px">
      <!-- row即为已有的菜单|按钮对象的数据 -->
      <template #="{ row }">
        <el-button
          plain
          type="primary"
          icon="Plus"
          v-if="row.level == 4 ? false : true"
          @click="addMenu(row)"
        >
          {{ row.level == 3 ? '添加功能' : ' 添加菜单' }}
        </el-button>
        <el-button
          plain
          type="warning"
          icon="Edit"
          :disabled="row.level == 1 ? true : false"
          @click="editMenu(row)"
        >
          编辑
        </el-button>

        <el-popconfirm
          width="220"
          icon="InfoFilled"
          icon-color="#626AEF"
          :title="`确认删除'${row.name}'吗？`"
          @confirm="deleteMenu(row.id)"
        >
          <template #reference>
            <el-button
              plain
              type="danger"
              icon="Delete"
              :disabled="row.level == 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 对话框组件：添加或更新菜单 -->
  <el-dialog v-model="dialogView" :title="title" width="500">
    <el-form :rules="rules" ref="formRef" :model="menuData">
      <el-form-item label="名称" label-width="80px" prop="name">
        <el-input
          type="text"
          placeholder="请输入名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>

      <el-form-item label="权限值" label-width="80px" prop="code">
        <el-input
          type="text"
          placeholder="请输入权限值"
          v-model="menuData.code"
        ></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <div>
        <el-button @click="dialogView = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateMenu,
  reqDeleteMenu,
  reqGetAllMenuData,
} from '@/api/acl/menu'
import {
  MenuParams,
  Permission,
  PermissionList,
  PermissionResponseData,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'

// 存储菜单的数据
let permissionArr = ref<PermissionList>([])
// 控制对话框的显示与隐藏
let dialogView = ref<boolean>(false)
// 对话框标题
let title = ref<string>('')
// 菜单携带参数
let menuData = reactive<MenuParams>({
  code: '', // 权限数值
  level: 0, // 几级菜单
  name: '', // 菜单的名字
  pid: 0, // 菜单的ID
})
// 获取form组件实例
let formRef = ref<any>()

// 组件挂载完毕
onMounted(() => {
  getHasPermission()
})

// 获取菜单数据的方法
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqGetAllMenuData()
  if (result.code == 200) {
    permissionArr.value = result.data
  }
}

// 添加菜单
const addMenu = (row: Permission) => {
  // 清除之前的错误信息
  removeLastError()
  // 清除之前收集的数据
  Object.assign(menuData, {
    code: '', // 权限数值
    level: 0, // 几级菜单
    name: '', // 菜单的名字
    pid: 0, // 菜单的ID
  })
  title.value = '添加菜单'
  dialogView.value = true
  // 收集新增菜单level数据并+1
  menuData.level = row.level + 1
  menuData.pid = row.id
}

// 编辑菜单信息
const editMenu = (row: Permission) => {
  // 清除之前的错误信息
  removeLastError()
  // 合并信息
  Object.assign(menuData, row)
  title.value = '更新菜单信息'
  dialogView.value = true
}

// 删除菜单
const deleteMenu = async (id: number) => {
  let result: any = await reqDeleteMenu(id)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    getHasPermission()
  } else {
    ElMessage.error('删除失败')
  }
}

// 添加|更新菜单对话框确认按钮回调
const save = async () => {
  // 表单校验结果通过才能发请求
  await formRef.value.validate()
  // 发请求
  let result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    ElMessage.success(title.value === '添加菜单' ? '添加成功' : '更新成功')
    dialogView.value = false
    // 重新获取已有菜单与按钮数据
    getHasPermission()
  } else {
    ElMessage.error(title.value === '添加菜单' ? '添加失败' : '更新失败')
  }
}

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

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' },
    { min: 2, max: 8, message: '名称长度在 2 到 8 个字符', trigger: 'blur' },
    { validator: check_space, trigger: 'blur' },
  ],
  code: [
    { required: true, message: '权限值不能为空', trigger: 'blur' },
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
</script>

<style lang="scss" scoped></style>
