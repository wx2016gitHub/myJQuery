
jQuery.noConflict();
jQuery(document).ready(function ($) {

    var DBdata = [
        { id: 11, name: "person11", balance: 100 },
        { id: 22, name: "person22", balance: 200 },
        { id: 33, name: "person33", balance: 300 },
        { id: 44, name: "person44", balance: 400 },
        { id: 55, name: "person55", balance: 500 },
    ];

    var blockKey = false;
    var find = -1;
    var activeButton = {};
    var currForm = 0;

    $("#form0").hide();
    $("#form1").hide();
    $("#form2").hide();
    $("#form3").hide();

    var form = [];
    for (var i = 0; i < 4; i++) form[i] = "#form" + i;

    var keepColor = $("button").css("background-color");

    function exitForm() {
        $(activeButton).css("background-color", keepColor);
        $(form[currForm]).blur(); $(form[currForm]).hide();
        switch (currForm) {
            case 0:
                $("#withdrawalID").val(""); $("#withdrawalInput").val("");
                break;
            case 1:
                $("#depositID").val(""); $("#depositInput").val("");
                break;
            case 2:
                $("#transferID").val(""); $("#accountID").val(""); $("#transferInput").val("");
                break;
            case 3:
                $("#statementID").val("");
                break;
        }
        blockKey = false;
        find = -1;
    }

    $("button").on("click", function (event) {
        var str = event.target.innerHTML;
        $("p").empty();
        if (!blockKey) {
            activeButton = event.target;
            if (str.indexOf("Withdrawal") != -1)
                currForm = 0;
            else if (str.indexOf("Deposit") != -1)
                currForm = 1;
            else if (str.indexOf("Transfer") != -1)
                currForm = 2;
            else if (str.indexOf("Statement") != -1)
                currForm = 3;
            $(form[currForm]).show(); $(form[currForm]).focus();
            $(event.target).css("background-color", "green");
            blockKey = true;
        }
        if (str === "Exit" && blockKey)
            exitForm();
    });

    var arrayID = $.map(DBdata, function (mvalue, mindex) {
        return mvalue.id;
    });
    function searchForm(searchId) {
        var index = 0, value = 0;
        $.each(arrayID, function (i, id) {
            if (Number(id) === Number(searchId) && find == -1) {
                find = 1; index = i;
                return true;
            }
        });
        if (find === 1) return index;
        else return -1;
    }

    //  ********************* form0 withdrawal ************************
    $("#cfmWithdrawal").click(function () {
        var retIndex = -1, balance = 0;
        var currId = $("#withdrawalID").val();
        var amountWithdrawal = $("#withdrawalInput").val();

        retIndex = searchForm(currId);
        if (retIndex != -1) {
            balance = Number(DBdata[retIndex].balance);
            if (Number(amountWithdrawal) > balance) {
                find = 2;
            }
            else {
                find = 0;
                balance -= Number(amountWithdrawal);
            }
            DBdata[retIndex].balance = balance;
        }
        switch (find) {
            case 0:
                $("p").html("<br><strong>You successfully Withdrawaled $" + amountWithdrawal + " from Account ID#" + currId + "</strong>");
                break;
            case 2:
                $("p").html("<br><strong>Account ID#" + currId + " do not have $" + amountWithdrawal + " for this  transaction of withdrawal. </strong>");
                break;
            case -1:
                $("p").text("can not find this account id.");
                break;
        }

        exitForm();
    });
    //  ********************* form1 deposit ***************************
    $("#cfmDeposit").click(function () {
        var retIndex = -1, balance = 0;
        var currId = $("#depositID").val();
        var amountDeposit = $("#depositInput").val();

        retIndex = searchForm(currId);
        if (retIndex != -1) {
            find = 0;
            balance = Number(DBdata[retIndex].balance);
            balance += Number(amountDeposit);
            DBdata[retIndex].balance = balance;
        }
        if (find == -1)
            $("p").text("can not find this account id.");
        else
            $("p").html("<br><strong>You successfully deposited $" + amountDeposit + " to Account ID#" + currId + "</strong>");

        exitForm();
    });
    //  ********************* form2 transfer ************************
    $("#cfmTransfer").click(function () {
        var retIndexTransfer = 0, retIndexAccount = 0;
        var arrayBalance = 0, value = 0;
        var findTransfer = -1;
        var transferId = $("#transferID").val();
        var currId = $("#accountID").val();
        var amountTransfer = $("#transferInput").val();

        retIndexTransfer = searchForm(transferId);
        if (retIndexTransfer != -1) {
            findTransfer = 1; find = -1;
            retIndexAccount = searchForm(currId);
            if (retIndexAccount != -1) {
                find = 1;
                value = Number(DBdata[retIndexAccount].balance);
                if (Number(amountTransfer) > Number(value)) {
                    find = 2;
                }
                else {
                    find = 0;
                    value = value - Number(amountTransfer);
                    DBdata[retIndexAccount].balance = value;
                    // alert("value= " + DBdata[retIndexTransfer].balance);
                    value = Number(DBdata[retIndexTransfer].balance);
                    findTransfer = 0;
                    value += Number(amountTransfer);
                    DBdata[retIndexTransfer].balance = value;
                }
            }
        }

        if (findTransfer == -1)
            $("p").html("<br>can not find transfer account id.");
        else if (find == -1 && findTransfer != -1)
            $("p").html("<br>can not find current account id.<br />");
        if (find == 2)
            $("p").html("<br><strong>Account ID#" + currId + " do not have $" + amountTransfer + " for this  transaction of transfer</strong>");
        if (find == 0)
            $("p").html("<br><strong>You successfully transferred from Account ID#" + currId + " $" + amountTransfer + " to Account ID# " + transferId + "</strong>");

        exitForm();
    });
    //  ********************* form3 Statement ************************
    $("#cfmStatement").click(function () {
        var retIndex = 0;
        var currId = $("#statementID").val();

        retIndex = searchForm(currId);

        if (find == -1)
            $("p").text("can not find this account id.");
        else
            $("p").html("<br /><strong>Acount Statement: </strong><br /><strong>id: " + DBdata[retIndex].id + " </strong><br /><strong>name: " + DBdata[retIndex].name + " </strong><br /><strong>balance:  " + DBdata[retIndex].balance + " </strong><br />");

        exitForm();
    });
});
// @copyright Wendy Xiao test jQery code 5/4/2016 