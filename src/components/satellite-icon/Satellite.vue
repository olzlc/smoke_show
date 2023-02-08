<template>
  <svg xmlns="http://www.w3.org/2000/svg" 
    :width="_width" 
    :height="_height"
    :spin="spin"
    :rtl="rtl"
    viewBox="0 0 1024 1024"
    preserveAspectRatio="xMidYMid meet"
    fill=""
    role="presentation"
    ref="host"
  >
    <g><path data-follow-fill="currentColor" d="M994.87 706.817 797.005 508.952c-3.098-3.098-8.194-3.098-11.292 0L666.295 628.37l-22.585-22.584 79.845-79.846c43.97-43.97 49.267-111.923 15.79-161.689l12.291-12.292c12.492-12.491 12.492-32.777 0-45.269l-42.67-42.77c-12.492-12.492-32.778-12.492-45.27 0l-14.19 14.19c-48.567-26.782-110.924-19.587-152.196 21.685l-79.845 79.845-22.585-22.584 119.418-119.418c3.098-3.098 3.098-8.195 0-11.293L316.434 28.481c-24.983-24.983-65.456-24.983-90.438 0L21.836 232.74c-24.984 24.983-24.984 65.455 0 90.438L219.7 521.044c3.098 3.098 8.194 3.098 11.292 0l118.719-118.719 22.585 22.585L203.41 593.794c-12.492 12.492-12.492 32.778 0 45.27l67.854 67.853-37.275 37.274c-36.575-25.183-79.146-37.674-121.717-37.674-15.989 0-31.978 1.799-47.667 5.296-9.694 2.199-19.187 4.997-28.58 8.495-3.998 1.499-7.995 3.197-11.992 4.896C9.744 731.6.65 745.79.749 761.48v13.99l.1 43.571c1.3-1.399 2.599-2.798 3.998-4.197a155.937 155.937 0 0 1 5.896-5.596c6.995-6.296 17.688-6.096 24.383.6l43.87 43.87c12.491 12.49 12.491 32.777 0 45.268l-13.99 13.99-19.887 19.887c-7.195 7.195-10.293 16.989-9.094 26.482.8 6.895 3.898 13.491 9.094 18.787a32.085 32.085 0 0 0 20.086 9.294c.8.1 1.7.1 2.499.1 8.194 0 16.389-3.098 22.584-9.394l33.877-33.876c12.492-12.492 32.778-12.492 45.27 0l15.489 15.489 39.672 39.673c6.696 6.695 6.896 17.388.7 24.383l23.784.1 28.38.1c16.29 0 30.98-9.893 36.675-25.083 0-.1.1-.2.1-.3 4.697-12.591 8.295-25.482 10.493-38.573 10.493-59.56-4.097-122.716-43.87-172.382l35.576-35.576 67.853 67.853c12.492 12.492 32.778 12.492 45.27 0L598.44 651.055l22.584 22.585-118.718 118.718c-3.098 3.098-3.098 8.195 0 11.293l197.864 197.864c24.983 24.983 65.456 24.983 90.439 0l204.26-204.26c24.983-24.983 24.983-65.455 0-90.438zM146.95 831.232l-58.86-58.86c7.894-1.3 15.989-1.899 24.183-1.899 26.882 0 52.664 6.896 75.449 19.987l-40.772 40.772zm115.32 115.32-70.151-70.151 43.17-43.17c18.787 25.782 28.88 56.66 28.88 89.138 0 8.195-.6 16.29-1.898 24.184zm619.477-262.32-79.845 79.846-22.585-22.585 79.846-79.845 22.584 22.584zm-90.438-90.438 22.585 22.585-79.846 79.845-22.584-22.584 79.845-79.846zm-452.19-452.29 22.584 22.584-79.846 79.845-22.584-22.584 79.845-79.846zm-79.147-56.462c6.196-6.196 16.39-6.196 22.585 0l11.292 11.292-79.845 79.846-22.585-22.585 68.553-68.553zM78.396 289.202c-6.295-6.295-6.295-16.388 0-22.584l67.854-67.854 22.585 22.585-79.146 79.146-11.293-11.293zm56.462 56.562 79.146-79.146 22.584 22.584-79.146 79.146-22.584-22.584zm90.438 90.438-22.585-22.585 79.146-79.146 22.585 22.585-79.146 79.146zm124.415-124.315-22.585-22.685 79.846-79.845 22.584 22.584-79.845 79.946zm248.73 248.73L412.568 746.49c-3.098 3.098-8.194 3.098-11.292 0L276.96 622.075c-3.098-3.098-3.098-8.195 0-11.293l265.718-265.718c24.983-24.983 65.455-24.983 90.438 0l45.27 45.27c24.982 24.982 24.982 65.454 0 90.437l-79.946 79.846zm-11.292 237.338 79.146-79.146 22.584 22.684-79.146 79.146-22.584-22.684zm90.438 90.538-22.585-22.585 79.146-79.146 22.585 22.585-79.146 79.146zm79.146 56.461c-6.196 6.196-16.39 6.196-22.585 0l-11.292-11.292 79.146-79.146 22.584 22.584-67.853 67.854zm181.576-181.576-68.554 68.553-22.584-22.584 79.845-79.846 11.293 11.293c6.195 6.195 6.195 16.388 0 22.584z" :fill="_fill"/></g>
  </svg>
</template>

<script lang="ts">
import { Vue, prop } from 'vue-class-component';

class Props {
    width = 0;
    height = 0;
    stroke?: string;
    fill='';
    color='';
    spin = null;
    rtl = null;

  // optional prop with default
  size = prop<number | string>({ default: '1em' })
}

export default class Satellite extends Vue.with(Props) {
    get _fill(): string | undefined {
        return this.fill || this.color
    }
    get _stroke(): string | undefined {
        return this.stroke || this.color
    }
    get _width(): string | number {
      return this.width || this.size
    }
    get _height(): string | number {
      return this.height || this.size
    }
  mounted():void {
        if (!this._fill) {
            (this.$refs.host as HTMLElement)?.querySelectorAll('[data-follow-fill]').forEach(item => {
            item.setAttribute('fill', item.getAttribute('data-follow-fill') || '')
            })
        }
        if (!this._stroke) {
            (this.$refs.host as HTMLElement)?.querySelectorAll('[data-follow-stroke]').forEach(item => {
            item.setAttribute('stroke', item.getAttribute('data-follow-stroke') || '')
            })
        }
    }
    updated():void {
        if (!this._fill) {
            (this.$refs.host as HTMLElement)?.querySelectorAll('[data-follow-fill]').forEach(item => {
            item.setAttribute('fill', item.getAttribute('data-follow-fill') || '')
            })
        }
        if (!this._stroke) {
            (this.$refs.host as HTMLElement)?.querySelectorAll('[data-follow-stroke]').forEach(item => {
            item.setAttribute('stroke', item.getAttribute('data-follow-stroke') || '')
            })
        }
    }
}
</script>

<style scoped>
svg[spin="true"] {animation: iconpark-spin 1s infinite linear;}
svg[spin="true"][rtl="true"] {animation: iconpark-spin-rtl 1s infinite linear;}
svg[rtl="true"] {
  transform: scaleX(-1);
}
@keyframes iconpark-spin {
  0% { -webkit-transform: rotate(0); transform: rotate(0);} 100% {-webkit-transform: rotate(360deg); transform: rotate(360deg);}
}
@keyframes iconpark-spin-rtl {
  0% {-webkit-transform: scaleX(-1) rotate(0); transform: scaleX(-1) rotate(0);} 100% {-webkit-transform: scaleX(-1) rotate(360deg); transform: scaleX(-1) rotate(360deg);}
}
</style>
