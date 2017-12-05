<!--
    菜单组件
-->
<template>
    <Menu mode="horizontal" theme="dark">
        <MenuItem name='avatar'>
            <Avatar size="large" style="background: #00a2ae;">{{ username }}</Avatar>
        </MenuItem>

        <router-link to="/dashboard">
            <MenuItem name="message">
            <Icon type="ios-home"></Icon>首页
            </MenuItem>
        </router-link>

        <router-link to="/app">
            <MenuItem name="app">
            <Icon type="social-windows-outline"></Icon>应用管理
            </MenuItem>
        </router-link>

        <router-link to="/resource">
            <MenuItem name="resource">
            <Icon type="ios-folder-outline"></Icon>资源&文件
            </MenuItem>
        </router-link>
    </Menu>
</template>

<style>
    .ivu-menu-item {
        font-size: 18px; 
    }
</style>

<script>
    export default {
        data () {
            return {
                username: "admin"
            }
        }
    }
</script>