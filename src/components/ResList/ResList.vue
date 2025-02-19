<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div 
      v-for="(item, index) in modelValue" 
      :key="index"
      class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all duration-200 hover:shadow-lg"
    >
      <!-- 删除按钮 -->
      <button 
        @click="handleDelete(index)"
        class="absolute right-2 top-2 z-10 rounded-full bg-destructive/90 p-1.5 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
      >
        <Trash2 class="h-4 w-4" />
      </button>

      <!-- 预览图 -->
      <div class="aspect-video w-full overflow-hidden bg-muted">
        <img 
          v-if="item.upload_result" 
          :src="formatURL(item.upload_result)" 
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <img 
          v-else
          :src="item.upload_blob" 
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <!-- 信息区域 -->
      <div class="p-4">
        <div class="flex items-center justify-between">
          <p class="font-medium truncate flex-1" :title="item.name">
            {{ item.name }}
          </p>
          <span class="text-xs text-muted-foreground ml-2">
            {{ formatFileSize(item.size) }}
          </span>
        </div>
        
        <!-- 上传状态 -->
        <div class="mt-2">
          <div v-if="item.upload_status === 'uploading'" class="flex items-center gap-2">
            <Loader2 class="h-4 w-4 text-primary animate-spin" />
            <span class="text-sm text-muted-foreground">上传中...</span>
          </div>
          
          <div v-else-if="item.upload_status === 'success'" class="space-y-2">
            <div class="flex items-center gap-2">
              <CheckCircle class="h-4 w-4 text-green-500" />
              <span class="text-sm text-muted-foreground">上传成功</span>
            </div>
            <!-- 链接复制区域 -->
            <div class="flex flex-wrap gap-2">
              <button
                @click="copyCodeValue(formatURL(item.upload_result))"
                class="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
              >
                复制URL链接
              </button>
              <button
                @click="copyCodeValue(formatURL(item.upload_result, 'md'))"
                class="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
              >
                复制Markdown
              </button>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button class="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                    <QrCode class="h-4 w-4" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent class="w-auto p-0">
                  <QrcodeVue 
                    :value="formatURL(item.upload_result)" 
                    :size="200" 
                    level="H"
                    class="p-2" 
                  />
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          
          <div v-else-if="item.upload_status === 'error'" class="flex items-center gap-2 text-destructive">
            <XCircle class="h-4 w-4" />
            <span class="text-sm">上传失败</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, QrCode, Trash2, Loader2 } from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue';
import { useToast } from '@/components/ui/toast/use-toast';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const { toast } = useToast();
const props = defineProps(['modelValue', 'nodeHost']);
const emit = defineEmits(['update:modelValue']);

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// URL格式化
const formatURL = (v: any, key?: string) => {
  let FILE_ID = '';
  const ERROR_MSG = `${v._vh_filename} 上传失败`;
  try {
    FILE_ID = v.data.link.split('/').slice(-1)[0];
  } catch {}
  if (key == 'md') {
    return FILE_ID ? `![${v._vh_filename}](${props.nodeHost}/v2/${FILE_ID})` : ERROR_MSG;
  }
  return FILE_ID ? `${props.nodeHost}/v2/${FILE_ID}` : ERROR_MSG;
};

// 复制CODE
const copyCodeValue = async (v: string) => {
  let vhCopyStatus: any = false;
  try {
    await navigator.clipboard.writeText(v);
    vhCopyStatus = true;
  } catch {
    const i = document.createElement('textarea');
    i.value = v;
    document.body.appendChild(i);
    i.select();
    vhCopyStatus = document.execCommand('copy');
    document.body.removeChild(i);
  } finally {
    if (vhCopyStatus) toast({ title: 'Tips', description: '复制成功' });
  }
};

// 删除处理函数
const handleDelete = (index: number) => {
  const newList = [...props.modelValue];
  newList.splice(index, 1);
  emit('update:modelValue', newList);
  toast({
    title: "删除成功",
    description: "已从历史记录中移除该图片",
  });
};
</script>

<style scoped lang="less">
@import 'ResList.less';
</style>
