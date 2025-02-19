<template>
  <section class="Upload group">
    <input 
      type="file" 
      multiple 
      @change="fileListChange" 
      :accept="UploadConfig.AcceptTypes"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
      title=" "
    />
    <div class="placeholder relative overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 px-4 py-12 text-center hover:border-muted-foreground/50 hover:bg-muted transition-all duration-200">
      <div class="pointer-events-none">
        <div class="mb-4 flex justify-center">
          <svg 
            class="h-12 w-12 text-muted-foreground/70 group-hover:text-muted-foreground/90 transition-colors" 
            viewBox="0 0 1335 1024"
          >
            <path
              d="M1097.060174 392.125217C1073.730783 172.966957 893.261913 0.378435 666.089739 0.378435c-227.127652 0-415.610435 171.920696-430.948174 391.746782C101.910261 415.454609 0 525.356522 0 666.601739c0 149.147826 125.239652 274.476522 274.476522 274.476522h195.828869v-78.669913H274.476522a193.691826 193.691826 0 0 1-195.940174-195.806609c0-102.021565 70.678261-180.580174 172.588522-195.917913l54.561391-8.013913 8.013913-62.553043c16.005565-180.580174 172.588522-321.157565 352.389565-321.157566 180.580174 0 337.029565 141.356522 352.389565 321.157566v62.553043l62.664348 8.013913c101.910261 16.005565 172.477217 93.896348 172.477218 195.917913 0 109.901913-85.904696 195.806609-195.806609 195.806609h-195.917913v78.580869h196.029217c149.147826 0 274.476522-125.261913 274.476522-274.476521 0-141.133913-101.999304-259.072-235.25287-274.387479"
              fill="#909399"
            ></path>
            <path d="M612.218435 364.766609l1.335652 2.003478L389.698783 590.58087l55.229217 55.362782 181.938087-181.938087V1018.88h78.558609v-78.58087h156.471652-156.471652V458.039652l183.808 183.919305 55.340521-55.340522-277.147826-277.058783-55.229217 55.229218z m-141.913044 575.666087h156.471652-156.716521 0.222608z" fill="#909399"></path>
          </svg>
        </div>
        <div class="space-y-2">
          <p class="text-xl font-medium text-foreground/90">
            点击上传 / 拖拽上传
          </p>
          <p class="text-sm text-muted-foreground">
            上传违反中国大陆、香港及美国法律的图片将会直接删除，并封禁设备IP
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '@/components/ui/toast/use-toast';
const { toast } = useToast();
// 参数
const props = defineProps(['modelValue', 'UploadConfig', 'uploadAPI']);
const emits = defineEmits(['update:modelValue']);
const UploadConfig = ref<any>(props.UploadConfig);
// 文件上传列表变化事件
const fileListChange = (v: Event) => {
  if (!v.target) return;
  const FileTarget: HTMLInputElement = v.target as HTMLInputElement;
  const FileListArr: Array<any> = [...props.modelValue, ...Array.from(FileTarget.files || [])];
  
  // 过滤不符合Size的文件
  let fileListFilter = FileListArr.filter((i: any) => UploadConfig.value.MaxSize && i.size <= UploadConfig.value.MaxSize * 1024 * 1024);
  if (fileListFilter.length != FileListArr.length) toast({ title: 'Tips', description: `已过滤Size超过 ${UploadConfig.value.MaxSize}MB 的文件` });
  
  // 过滤超过数量的文件
  if (UploadConfig.value.Max && fileListFilter.length > UploadConfig.value.Max) {
    toast({ title: 'Tips', description: `已过滤超过最大上传 ${UploadConfig.value.Max}个 的文件` });
    fileListFilter = Array.from(FileTarget.files || []).slice(0, UploadConfig.value.Max);
  }

  // 保存文件基本信息
  fileListFilter = fileListFilter.map(file => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    upload_status: file.upload_status || 'pending',
    upload_progress: file.upload_progress || 0,
    upload_result: file.upload_result || null,
    upload_blob: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
  }));

  emits('update:modelValue', fileListFilter);
  fileUpload(fileListFilter);
};

// 上传
const fileUpload = async (FileListArr: Array<any>) => {
  FileListArr.forEach(async (i: any) => {
    if (i.upload_status === 'success') return; // 跳过已成功上传的文件
    
    const formData = new FormData();
    formData.append('file', i);

    // 同步上传状态
    i.upload_status = 'uploading';
    emits('update:modelValue', [...FileListArr]);

    try {
      // 发送请求
      const res = await fetch(props.uploadAPI, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      i.upload_result = {
        ...result,
        _vh_filename: i.name // 保存文件名
      };
      i.upload_status = 'success';
    } catch (error) {
      i.upload_status = 'error';
      i.upload_result = error;
    } finally {
      emits('update:modelValue', [...FileListArr]);
    }
  });
};
</script>

<style scoped>
.Upload {
  position: relative;
  width: 100%;
}

/* 隐藏文件输入框的默认提示 */
input[type="file"]::-webkit-file-upload-button {
  cursor: pointer;
}

input[type="file"]::file-selector-button {
  cursor: pointer;
}
</style>
