<template>
    <div>
    <el-row class="tac">
  <el-col :span="12">
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose">
       
        <div v-for="item in body" :key="item.orgType" :index="item.id">

            <el-menu-item :index="item.id" v-if="!item.departments">
                <i :class="item.iconfont"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>

            <el-submenu v-if="item.departments" :index="item.id">
                <template slot="title" :index="item.id">
                    <i :class="item.iconfont"></i>
                    <span slot="title">{{item.name}}</span>
                </template>

                <span v-if="item.departments">
                    <el-menu-item :index="item.id" v-for="key in item.departments" :key="key.o">
                        <i :class="key.iconfont"></i>
                        <span slot="title">{{key.shortname}}</span>
                    </el-menu-item>
                </span>
            </el-submenu>
        </div>
    </el-menu>
  </el-col>
    </el-row>
    </div>
</template>


<script>
export default {
  data() {
    return {
        "body":[
            {
                "id":'1',
                "name":"标准组织",
                "iconfont":'el-icon-tickets',
                "orgType":"StandardsOrganization",
                "departments":[
                    {
                        "iconfont":'el-icon-star-off',
                        "o":"ST873053466635D",
                        "shortname":"美的控股(标准组织)"
                    }
                ],
                "departmentOperates":null,
                "accouts":null,
                "accoutOperates":null
            },
            {
                "id":'2',
                "name":"公共组织",
                "iconfont":'el-icon-view',
                "orgType":"PublicOrganization",
                "departmentOperates":null,
                "accouts":null,
                "accoutOperates":null
            },
            {
                "id":'3',
                "name":"临时组织",
                "iconfont":'el-icon-menu',
                "orgType":"InternalTempOrganization",
                "departments":[
                    {
                        "iconfont":'el-icon-rank',
                        "o":"MIDEA1356592829849A",
                        "shortname":"地产集团(临时)"
                    }
                ],
                "departmentOperates":null,
                "accouts":null,
                "accoutOperates":null
            },
            {
                "id":'4',
                "name":"内部组织",
                "iconfont":'el-icon-setting',
                "orgType":"InternalOrganization",
                "departments":[
                    {
                        "iconfont":'el-icon-share',
                        "o":"00017661",
                        "shortname":"美的控股"
                    }
                ],
                "departmentOperates":null,
                "accouts":null,
                "accoutOperates":null
            },
            {
                "id":'5',
                "name":"职能组织",
                "iconfont":'el-icon-circle-close-outline',
                "orgType":"FunctionOrganization",
                "departments":[
                    {
                        "iconfont":'el-icon-remove',
                        "o":"DU0429091034010",
                        "shortname":"地产集团(职能)"
                    }
                ],
                "departmentOperates":null,
                "accouts":null,
                "accoutOperates":null
            },
            {
                "id":'6',
                "name":"外部组织",
                "iconfont":'el-icon-delete',
                "orgType":"ExternalOrgnization",
                "departments":[
                    {
                        "iconfont":'el-icon-edit',
                        "o":"MIDEA1400494878487A",
                        "shortname":"地产集团(外部)"
                    }
                ],
                "departmentOperates":null,
                "accouts":null,
                "accoutOperates":null
            },
            {
                "id":'7',
                "name":"应用组织",
                "iconfont":'el-icon-loading',
                "orgType":"ApplicationOrganization",
                "departmentOperates":null,
                "accouts":null,
                "accoutOperates":null
            },
            {
                "id":'8',
                "name":"账套组织",
                "iconfont":'el-icon-upload2',
                "orgType":"AcccountOrganization",
                "departmentOperates":null,
                "accouts":null,
                "accoutOperates":null
            }
        ],
    };
  },
    methods: {
        
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        }
    },
};
</script>