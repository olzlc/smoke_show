<template>
  <div id="whole-application">
    <div id="nav">
      <el-menu mode="horizontal" :default-active="$route.path">
        <el-menu-item index="1">
          <router-link to="/">开始搜索</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/Mapbox">地图展示</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/Poishow">探索数据</router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding-bottom: 15px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #2089df !important;
  text-decoration: none;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #2089df !important;
}

.el-menu {
  justify-content: center;
}

.el-menu-item {
  padding: 0 !important;
}

.el-menu-item a {
  padding: 0 20px !important;
}

.confirm-error-button {
  background: #f56c6c !important;
  border-color: #f56c6c !important;
}
</style>
