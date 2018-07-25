/**
 * Created by 12934 on 2018/7/26.
 */
window.onload=function(){
    f();
};
function f(){
    $('.del').click(function(){
        let This=this;
        let id=$(this).attr('value');
        console.log(id);
        // if(false === confirm('是否确定删除该信息？')) return;
        $.ajax({
            url:'./delkw',
            type:'POST',
            dataType:'JSON',
            data:{id123:id},
            success:function (data) {
                console.log(data);
                if(data.r=="success"){
                    console.log('删除成功');
                    $(This).parent().parent().remove();
                }
            }
        });
    });
}