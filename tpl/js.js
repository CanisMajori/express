/**
 * Created by 12934 on 2018/7/26.
 */
window.onload=function(){
    del();//删除操作
    selall();//选择函数
    delall();//全部删除

};
function del(){
    $('.del').click(function(){
        let This=this;
        let id=$(this).attr('value');
        console.log(id);
        if(false === confirm('是否确定删除该信息？')) return;
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
function selall(){
    //全选按钮：
    $('.selall').click(function () {
        //给所有name为id[?]的复选框加上checked属性，即选中
        $('input[name="id[]"]').prop('checked',true);
    })
    //反选按钮
    $('.fanxuan').click(function () {
        $('input[name="id[]"]').each(function (ind,item) {
            //属性取反
            $(item).prop('checked', !$(item).prop('checked'));
        });
    })

}
function delall(){
    $('.delall').click(function () {
        if(!confirm('确定删除全部？？？，此操作不可挽回'))return ;
        $.ajax({
            url: './delall',
            dataType: 'JSON',
            type: 'POST',
            data: $('#mkw').serialize(),
            success: function (data) {
                console.log(data);
                if(data.r=='success')window.location.reload();
                if(data.r=='fail') alert('删除失败');
            }


        });




    })
}

