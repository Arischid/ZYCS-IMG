<template>
  <section class="Home container mx-auto px-4 pt-20 sm:pt-24">
    <div class="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-primary/70 to-primary bg-clip-text text-transparent">
        骤雨重山图床
      </h1>
      <p class="text-muted-foreground text-lg sm:text-xl">
        无限图片储存空间，安全稳定的图片托管服务
      </p>
    </div>

    <Alert class="max-w-3xl mx-auto mb-8">
      <AlertTitle class="font-bold flex gap-2 items-center">
        <RocketIcon class="h-4 w-4" />
        提示
      </AlertTitle>
      <AlertDescription class="text-sm sm:text-base">
        <p class="text-muted-foreground">无限图片储存数量，你可以上传不限数量的图片！</p>
        <p class="font-medium mt-1">开源地址: 
          <a 
            href="https://github.com/uxiaohan/ZYCS-IMG" 
            target="_blank"
            class="text-primary hover:text-primary/80 transition-colors"
          >
            ZYCS-IMG
          </a>
        </p>
      </AlertDescription>
    </Alert>

    <!-- 上传区域 -->
    <div class="max-w-3xl mx-auto space-y-8">
      <Upload 
        v-model="fileList" 
        :UploadConfig="UploadConfig" 
        :uploadAPI="uploadAPI" 
        class="transition-all duration-200 hover:scale-[1.01]"
        @update:modelValue="handleFileListUpdate"
      />
      
      <!-- 展示区域 -->
      <ResList 
        v-model="fileList" 
        :nodeHost="nodeHost"
        class="min-h-[200px]"
        @update:modelValue="handleFileListUpdate"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Upload from '@/components/Upload/Upload.vue';
import ResList from '@/components/ResList/ResList.vue';
import { RocketIcon } from '@radix-icons/vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// IPFS节点
const nodeHost = ref<string>(import.meta.env.VITE_IMG_API_URL || location.origin);
// 上传接口
const uploadAPI = ref<string>(`${import.meta.env.VITE_IMG_API_URL || location.origin}/upload`);
// 上传配置
const UploadConfig = ref<any>({
  AcceptTypes: 'image/*', // 允许上传的类型，使用逗号分隔
  Max: 0, //多选个数，0为不限制
  MaxSize: 20, //单个文件大小限制，单位：MB
});
// 上传列表
const fileList = ref<Array<any>>([]);

// 保存到本地存储
const saveToLocalStorage = (list: any[]) => {
  try {
    // 只保存必要的信息
    const savedList = list.map(item => ({
      name: item.name,
      size: item.size,
      type: item.type,
      upload_status: item.upload_status,
      upload_progress: item.upload_progress,
      upload_result: item.upload_result,
      upload_blob: item.type?.startsWith('image/') ? item.upload_blob : null
    }));
    localStorage.setItem('uploadHistory', JSON.stringify(savedList));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// 从本地存储加载
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('uploadHistory');
    if (saved) {
      const parsedList = JSON.parse(saved);
      // 确保所有必要的字段都存在
      fileList.value = parsedList.map((item: any) => ({
        name: item.name || 'Unknown',
        size: item.size || 0,
        type: item.type || 'unknown',
        upload_status: item.upload_status || 'error',
        upload_progress: item.upload_progress || 100,
        upload_result: item.upload_result || null,
        upload_blob: item.upload_blob || null
      }));
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
};

// 处理文件列表更新
const handleFileListUpdate = (newList: any[]) => {
  fileList.value = newList; // 确保本地状态更新
  saveToLocalStorage(newList);
};

// 组件挂载时加载历史记录
onMounted(() => {
  loadFromLocalStorage();
});
</script>

<style scoped lang="less">
@import 'Home.less';
</style>
