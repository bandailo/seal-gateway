pragma solidity ^0.4.23;


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

    /**
     * @dev Multiplies two numbers, throws on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
     * @dev Integer division of two numbers, truncating the quotient.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
     * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
     * @dev Adds two numbers, throws on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor(address _owner) public {
        owner = _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

}


contract ERC20 {
    function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    function allowance(address owner, address spender) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}


/**
 * @title Airdropper
 * @dev An "airdropper" or "bounty" contract for distributing an ERC20 token
 *   en masse.
 * @dev This contract does not hold any tokens. Instead, it transfers directly
 *   from a given source address to the recipients. Ensure that the source
 *   address has set a sufficient allowance for the address of this contract.
 */
contract Airdropper is Ownable {
    using SafeMath for uint;

    ERC20 public token;

    constructor(address _token, address _owner) public Ownable(_owner) {
        token = ERC20(_token);
    }

    function setToken(address tokenAddress) public onlyOwner {
        token = ERC20(tokenAddress);
    }

    function airdrop(address _source, address _dest, uint _value) public onlyOwner {
        require(token.transferFrom(_source, _dest, _value));
    }

    /**
     * @dev Airdrops some tokens to some accounts.
     * @param _source The address of the current token holder.
     * @param _dests List of account addresses.
     * @param _values List of token amounts. Note that these are in whole
     *   tokens. Fractions of tokens are not supported.
     */
    function airdropList(address _source, address[] _dests, uint[] _values) public onlyOwner {
        // This simple validation will catch most mistakes without consuming
        // too much gas.
        require(_dests.length == _values.length);

        for (uint256 i = 0; i < _dests.length; i++) {
            require(token.transferFrom(_source, _dests[i], _values[i]));
        }
    }

    /**
     * @dev Return all tokens back to owner, in case any were accidentally
     *   transferred to this contract.
     */
    function returnTokens() public onlyOwner {
        token.transfer(owner, token.balanceOf(this));
    }

    /**
     * @dev Destroy this contract and recover any ether to the owner.
     */
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}
