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