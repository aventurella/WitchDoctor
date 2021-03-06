<?php
/**
 *    AxisMundi
 * 
 *    Copyright (C) 2010 Adam Venturella
 *
 *    LICENSE:
 *
 *    Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *    use this file except in compliance with the License.  You may obtain a copy
 *    of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *    This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 *    without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR 
 *    PURPOSE. See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 *    Author: Adam Venturella - aventurella@gmail.com
 *
 *    @package forms
 *    @subpackage validators
 *    @author Adam Venturella <aventurella@gmail.com>
 *    @copyright Copyright (C) 2010 Adam Venturella
 *    @license http://www.apache.org/licenses/LICENSE-2.0 Apache 2.0
 *
 **/
class AMMatchValidator extends AMValidator
{
	public function __construct($key1, $key2, $required=AMValidator::kOptional, $message=null)
	{
		$this->isRequired = $required;
		$this->key        = array($key1, $key2); 
		$this->message    = $message;
	}
	
	public function validate()
	{
		$value1 = $this->form->{$this->key[0]};
		$value2 = $this->form->{$this->key[1]};
		
		if($value1 == $value2)
		{
			$this->isValid = true;
		}
		else
		{
			$this->isValid  = false;
		}
	}
}
?>