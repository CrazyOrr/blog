# 站点组件总览

## 基本

### 按钮 Button

<br/>
<div class="vp-raw flex gap-2">
<ui-button :icon="Origami">Brand</ui-button>
<ui-button :icon="Aperture" />
<ui-button variant="alt">Alt</ui-button>
</div>


### 输入框 Input

<br/>
<div class="vp-raw flex gap-2">
<ui-input class="grow" placeholder="Name" />
<ui-input class="grow" placeholder="Email" />
</div>


## 文本块

### 许可协议

<br/>
<LicensingBlock />


<script setup lang="ts">
import { Origami, Aperture } from 'lucide-vue-next'
import LicensingBlock from '@/components/blocks/LicensingBlock.vue'
</script>
