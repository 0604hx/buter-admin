<!--
    计算面板
    左右分别显示图标、数值（可设置小标题），参考：https://github.com/iview/iview-admin/blob/dev/src/views/home/components/inforCard.vue
-->
<style>
    .infor-card-icon-con{
        height: 100%;
    }
    .height-100{
        height: 100%;
    }
    .infor-card-con{
        height: 100px;
    }
    .infor-intro-text{
        font-size:12px;
        font-weight:500;
        color:#C8C8C8;
    }
</style>

<template>
    <Card :padding="0">
        <div class="infor-card-con">
            <Col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
                <Row class="height-100" type="flex" align="middle" justify="center">
                    <Icon :type="iconType" :size="iconSize"></Icon>
                </Row>
            </Col>
            <Col span="16" class="height-100">
                <Row type="flex" align="middle" justify="center" class="height-100">
                    <div>
                        <p>{{ value }}</p>
                        <p class="infor-intro-text" slot="intro">{{ text }}</p>
                    </div>
                </Row>
            </Col>
        </div>
    </Card>
</template>

<script>
export default {
    props: {
        value: Number,
        color: String,
        iconType: String,
        text: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        iconSize: {
            type: Number,
            default: 40
        }
    }
}
</script>
    