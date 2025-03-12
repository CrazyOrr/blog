# 站点组件总览

## 按钮 Button

<div class="vp-raw flex gap-2">
<ui-button :icon="Origami">Brand</ui-button>
<ui-button :icon="Aperture" />
<ui-button variant="alt">Alt</ui-button>
</div>


## 输入框 Input

<div class="vp-raw flex gap-2">
<ui-input class="grow" placeholder="Name" />
<ui-input class="grow" placeholder="Email" />
</div>

<script setup lang="ts">
import { Origami, Aperture } from 'lucide-vue-next'
</script>
