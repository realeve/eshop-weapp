export const htmlFormat = (body) => {
  return (((body || '').replace(/(  +)/g, " ")
    .replace(/> /g, ">")
    .replace(/\r|\n/g, "")
    .match(/\<body\>([\s\S]*)\<\/body\>/) || [])[1] || "").replace(/<\s*div[^>]*>/g, '').replace(/<\/div>/g, '');
}

export const HTML = `<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>免责条款</title>
    <style>
        html {
            font-size: 100px;
        }

        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-size: 0.18rem;
            /* line-height: 0.36rem; */
            max-width: 800px;
            margin: 0 auto;
        }

        .container {
            color: #808287;
            padding: 0.1rem;
            background: -webkit-linear-gradient(top, #e7d9bc, #c0a061);
        }

        .container>.clause {
            padding: 0.23rem 0.18rem;
            background: #fff;
            border-radius: 0.04rem;
            line-height: 0.27rem;
        }

        .container>.clause>.title {
            color: rgb(83, 83, 83);
            text-align: center;
            margin-bottom: 1em;
        }

        .container>.clause>.clause_introduce {
            text-indent: 2em;
        }

        .container>.clause>.clause_div>.clause_title {
            color: #b88d66;
            margin: 0.12rem 0 0.04rem;
        }

        .container>.clause>.clause_div>.clause_text {
            color: #808287;
            margin-bottom: 0.06rem;
            text-indent: 2em;
        }

        .container>.clause>.clause_div>.clause_text>strong {
            color: black;
            font-weight: bolder;
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="clause">
            <div class="clause_div">
                <p class="clause_text"> 2020年4月1日7时起，中钞贵金属电商平台发行瑞鼠纳福银章，中钞贵金属电商平台采用预约抽签购买方式进行该产品销售，预约抽签销售总量300套。预约抽签购买有关规则如下：
                </p>
                <h4 class="clause_title">一、瑞鼠纳福银章预约抽签资格</h4>
                <p class="clause_text">凡中国大陆境内，完成中钞贵金属电商平台实名认证的注册用户（以下简称用户）均有瑞鼠纳福银章预约抽签资格。
                </p>
            </div>
            <div class="clause_div">
                <h4 class="clause_title">二、抽签与购买数量</h4>
                <p class="clause_text">一名预约成功用户计一签，于2020年4月5日0时预约结束，平台于2020年4月5日根据抽签规则计算出中签用户，于2020年4月5日10时在中钞贵金属电商平台公布，每一中签用户可购买一件瑞鼠纳福银章。</p>
            </div>
            <div class="clause_div">
                <h4 class="clause_title">三、抽签计算规则</h4>
                <p class="clause_text">A：基数；B：翻转数； X：报名次数；Y：种子号，即起始中签号；Z：阶数；</p>
                <p class="clause_text">
                    ①A=（抽签日的上一个工作日的深圳证券交易所深证成指“今收”指数×100)× （抽签日的上一个工作日的深圳证券交易所中小板指“今收”指数×100）×10000；
                </p>
                <p class="clause_text">
                    注：可登录深圳证券交易所网站历史指数行情查询，详见下文附录。A为整数，不能有小数位。
                </p>
                <p class="clause_text">②B=将基数A对应的数字倒序排列（如首位是0，则直接抹去）；</p>
                <p class="clause_text">③Y=B/X后所得的余数加1；</p>
                <p class="clause_text">④Z=X/中签数量取整数（去掉小数点后的整数）；</p>
                <p class="clause_text">⑤最终全部中签的报名号，如下：</p>
                <p class="clause_text">第一个中签号=Y;</p>
                <p class="clause_text">第二个中签号=Y+Z；</p>
                <p class="clause_text">第三个中签号=Y+Z*2；</p>
                <p class="clause_text">第N个中签号=Y+Z*(N-1)；</p>
                <p class="clause_text">如果第N个中签号码>总报名次数，那么第N个中签号码=Y+Z*(N-1)-总报名次数。</p>
            </div>
            <div class="clause_div">
                <h4 class="clause_title">四、购买资格</h4>
                <p class="clause_text">为保证本次瑞鼠纳福银章申购的公平、公正，用户收货信息中“收货人姓名”与“手机号”必须与实名认证录入信息一致，平台将进行数据比对，比对结果不一致用户将视同放弃本次瑞鼠纳福银章购买资格。
                </p>
            </div>
            <div class="clause_div">
                <h4 class="clause_title">五、购买支付时限</h4>
                <p class="clause_text">                    2020年4月7日13:00前，中签用户需在平台完成付款流程，确认购买意愿。超过支付时限未付款订单，视同放弃瑞鼠纳福银章购买权利，平台自动关闭订单。
                </p>
            </div>
            <div class="clause_div">
                <h4 class="clause_title">六、商品发货条件及周期</h4>
                <p class="clause_text">                    中签用户完成付款流程,订单状态显示为“待发货”后，平台组织发货，根据付款时间先后顺序进行物流排序，发货时间为付款截止3个工作日内（以订单发货状态和物流短信为准）。
                </p>
            </div>
            <div class="clause_div">
                <h4 class="clause_title">七、收货确认及售后服务</h4>
                <p class="clause_text">                    1、收货：平台将会把商品送到会员在订单中指定的收货地址并交订单中指定的收货人签收。请会员清楚准确地填写收货人的真实姓名、收货地址及联系方式。平台将按订单载明的收货地址、收货人、联系电话进行送货。平台所递送的商品应由收货人本人签收，如需他人代收的，请提供提货码告知配送人员。
                </p>
                <p class="clause_text">用户在接收产品时必须与配送人员进行当面开包、验收。</p>
                <p class="clause_text">2、售后服务：</p>
                <p class="clause_text">                    本次瑞鼠纳福银章预约销售活动，不适用7天无理由退货，无质量问题平台不提供退换货服务。若出现产品质量问题，需提供经物流人员见证的图片、影像资料申请售后，无物流人员见证的申请资料平台将不予采信。
                </p>
                <p class="clause_text">
                    本规则中描述的质量问题为，瑞鼠纳福银章包装或主体破损。
                </p>
                <p class="clause_text">
                    平台提供两种售后处理方式：退货、换货。用户提交售后申请资料，经平台管理员审核同意后可进行瑞鼠纳福银章的退货、换货操作，因此产生的物流费用由平台承担。
                </p>
                <p class="clause_text">
                    退回产品用户必须保证其完整性，包括主体、包装、证书及配件等，保证退回产品与提供的售后申请资料一致，否则平台不予进行售后处理。
                </p>
                <p class="clause_text"> 换货产品平台提供产品整体更换，不对产品主体、包装、证书及配件等做单独更换。 </p>
                <p class="clause_text"> 3、收货确认 </p>
                <p class="clause_text">
                    物流签收后3日内，用户可进行平台收货确认，完成订单。物流签收3日后，平台根据物流签收反馈情况自动进行收货确认，完成订单。
                </p>

            </div>
            <div class="clause_div">
                <h4 class="clause_title">八、发票开具</h4>
                <p class="clause_text"> 用户在完成确认收货后，平台将即刻开具增值税普通电子发票。 </p>
                <p class="clause_text">
                    “购货单位名称”为“个人”，“货物或应税劳务”以实际购买产品名称为准，“价税合计金额”为用户实际购买金额。用户可在平台确认收货的订单中进行电子发票的查询及下载。
                </p>
            </div>
            <div class="clause_div">
                <h4 class="clause_title">九、免责条款</h4>
                <p class="clause_text">
                    1、 如因不可抗力或其它平台无法控制的原因使平台销售系统崩溃或无法正常使用导致申购无法完成或丢失有关的信息、记录等，平台会合理地尽力协助处理善后事宜。 </p>
                <p class="clause_text"> 2、
                    超限购买：每期抽签购每位用户申购成功后可购买1件商品，但因平台自身技术原因，造成用户在购买时超出平台限定的商品数量，平台有权取消用户超出限制购买部分的商品数量，同时将超出部分商品的支付金额返还用户。
                </p>
                <p class="clause_text"> 3、 其他情况：除“超限购买”原因外，其他因平台技术原因引起的订单失效或订单错误，由此造成用户购物权益受损，根据以下方式解决： </p>
                <p class="clause_text">
                    1）如果销售活动未结束，平台有权取消该订单，并及时通知用户重新下单，用户需及时在销售结束前重新下单。用户须按照平台的通知方式重新购买，否则视为自动放弃该购物权益； </p>
                <p class="clause_text"> 2）如果销售活动已结束，由平台与用户另行协商解决。</p>
            </div>
            <div class="clause_div">
                <h4 class="clause_title">十、其他相关条款</h4>
                <p class="clause_text">
                    1、如果申购人数未达预约抽签销售总量及平台的相关规定，中钞贵金属电商平台可以根据规则取消抽签活动，变更销售方式。
                </p>
                <p class="clause_text"> 2、本规则中涉及的未描述交易事项，参见中钞贵金属电子商务服务平台相关交易条款。 </p>
                <p class="clause_text"> 3、在法律允许的最大限度范围内，中钞贵金属电商平台对本活动拥有解释权。 </p>

            </div>
        </div>
</body>

</html>

</html>`