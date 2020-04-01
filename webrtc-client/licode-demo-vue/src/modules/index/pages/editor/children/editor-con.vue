<template>
    <div style="height:100%">
        <script id="answereditor" type="text/plain" style="width:100%; height:100px"></script>
    </div>

</template>

<script>
    import ueditor from '@/script/index/ueditor'
    export default {
        data(){
            return {
                info: '我是editor',
            }
        },
        mounted(){
            ueditor.Init({
                el      : 'answereditor',
                toolbars: [[
                    'paragraph', 'bold', 'italic', 'underline', 'blockquote', 'insertorderedlist', 'insertunorderedlist', 'insertcode', '|', 'link', 'unlink', 'horizontal', 'insertimage', '|', 'removeformat', 'undo', 'redo', 'fullscreen', 'formula'
                ]],
                zIndex  : 1,
            });

        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
