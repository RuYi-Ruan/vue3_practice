<template>
  <el-card style="margin: 10px 0">
    <el-form :inline="true" class="form">
      <el-form-item label="角色名称">
        <el-input
          type="text"
          placeholder="请输入职位名称"
          v-model="roleName"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="search"
          :disabled="roleName ? false : true"
        >
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card>
    <el-button type="primary" plain icon="Plus" @click="addRole">
      添加职位
    </el-button>
    <el-table border style="margin: 10px 0" :data="roleArr">
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column
        label="id"
        align="center"
        width="80px"
        prop="id"
      ></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="320px">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            plain
            icon="User"
            @click="assignPermission(row)"
          >
            分配权限
          </el-button>
          <el-button type="warning" plain icon="Edit" @click="updateRole(row)">
            编辑
          </el-button>
          <el-popconfirm
            width="220"
            icon="InfoFilled"
            icon-color="#626AEF"
            :title="`确认删除${row.roleName}吗？`"
            @confirm="deleteRole(row.id)"
          >
            <template #reference>
              <el-button type="danger" plain icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 添加|更新职位对话框 -->
  <el-dialog v-model="dialogView" :title="title">
    <el-form :model="RoleParams" :rules="rules" ref="formRef">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          type="text"
          placeholder="请输入职位名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button plain @click="dialogView = false">取消</el-button>
        <el-button type="primary" plain @click="save">确认</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 分页器组件 -->
  <el-pagination
    v-model:current-page="pageNo"
    v-model:page-size="pageSize"
    :page-sizes="[3, 5, 7, 9]"
    :background="true"
    layout="prev, pager, next, jumper, ->, total, sizes"
    :total="total"
    style="margin: 10px 0; text-align: right"
    @current-change="getHasRole"
    @size-change="getHasRole()"
  ></el-pagination>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateRole,
  reqAssignPermission,
  reqDeleteRole,
  reqGetAllPermission,
  reqGetAllRole,
} from '@/api/acl/role'
import {
  MenuList,
  MenuResponseData,
  RoleResponseData,
} from '@/api/acl/role/type'
import { RoleData } from '@/api/acl/user/type'
import { ElMessage, ElTree } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'
// 当前页码
let pageNo = ref<number>(1)
// 当前页面数据数限制
let pageSize = ref<number>(3)
// 数据总数
let total = ref<number>(100)
// 职位名称
let roleName = ref<string>('')
// 存储职位信息
let roleArr = ref<RoleData[]>([])
// 控制对话框的显示与隐藏
let dialogView = ref<boolean>(false)
// 对话框标题
let title = ref<string>('')
// 收集新增岗位数据
let RoleParams = reactive<RoleData>({
  roleName: '',
  remark: null,
})
// 获取form组件实例
let formRef = ref<any>()
// 控制抽屉组件的显示与隐藏
let drawer = ref<boolean>(false)
// 存储职位数据
let menuArr = ref<MenuList>([])
// 存储树组件中勾选节点的ID(叶子结点)
let selectArr = ref<number[]>([])
// 获取树组件实例
let treeRef = ref<any>()

// 挂载后获取全部职位信息
onMounted(() => {
  getHasRole()
})

// 获取全部职位
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqGetAllRole(
    pageNo.value,
    pageSize.value,
    roleName.value,
  )
  if (result.code == 200) {
    roleArr.value = result.data.records as RoleData[]
    total.value = result.data.total
  }
}

// 搜索按钮回调
const search = () => {
  // 根据关键字获取查询列表
  getHasRole()
  // 清空关键字
  roleName.value = ''
}

// 重置按钮回调
// 重置按钮回调
const reset = () => {
  // settingStore.refresh = !settingStore.refresh;
  // 重新发一次请求也行
  getHasRole()
}

// 添加职位按钮回调
const addRole = () => {
  // 清除之前的错误信息
  removeLastError()
  // 清除之前收集的数据
  Object.assign(RoleParams, {
    roleName: '',
  })
  dialogView.value = true
  title.value = '添加职位'
}

const updateRole = (row: RoleData) => {
  // 清除之前的错误信息
  removeLastError()
  // 提取选中数据
  Object.assign(RoleParams, row)
  dialogView.value = true
  title.value = '更新职位信息'
}

// 表单校验规则
const rules = {
  roleName: [
    { required: true, trigger: 'blur' },
    { min: 2, max: 8, message: '字数限制在2-8', trigger: 'blur' },
  ],
}

// 添加|更新岗位对话框确认按钮回调
const save = async () => {
  // 表单校验结果通过才能发请求
  await formRef.value.validate()
  // 发起添加或更新职位的请求
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage.success(title.value == '添加职位' ? '添加成功' : '更新成功')
    dialogView.value = false
    // 重新获取岗位信息
    getHasRole(title.value == '添加职位' ? 1 : pageNo.value)
  } else {
    ElMessage.error(title.value == '添加职位' ? '添加失败' : '更新失败')
  }
}

// 清除上次的错误信息
const removeLastError = () => {
  // 清除上次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate()
  })
}

// 分配权限按钮回调
const assignPermission = async (row: RoleData) => {
  drawer.value = true
  // 收集要分配权限的职位的数据
  Object.assign(RoleParams, row)
  // 发起请求获取职位权限
  let result: MenuResponseData = await reqGetAllPermission(
    RoleParams.id as number,
  )
  if (result.code == 200) {
    menuArr.value = result.data
    // 筛选勾选的权限节点
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
// 过滤tree组件4级id
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })

  return initArr
}

// 树组件默认参数
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 抽屉组件确认按钮回调
const handler = async () => {
  // 收集参数
  // 选中职位id
  const roleId = RoleParams.id as number
  // 选中节点id
  let permissionIdArr = treeRef.value?.getCheckedKeys()
  // 半选节点的id
  let halfSelectIdArr = treeRef.value?.getHalfCheckedKeys()
  // 整合
  let totalPermissionIdArr = permissionIdArr?.concat(halfSelectIdArr)
  // 发起请求
  let result: any = await reqAssignPermission(roleId, totalPermissionIdArr)

  if (result.code == 200) {
    drawer.value = false
    ElMessage.success('分配权限成功')
    // 页面刷新
    window.location.reload()
  } else {
    ElMessage.error('分配权限失败')
  }
}

const deleteRole = async (roleId: number) => {
  // 发起请求
  let result: any = await reqDeleteRole(roleId)
  if (result.code == 200) {
    ElMessage.success('删除成功')
    getHasRole(roleArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
