/*
 ************************************************************************************
 * Copyright (C) 2001-2009 encuestame: system online surveys Copyright (C) 2009
 * encuestame Development Team.
 * Licensed under the Apache Software License version 2.0
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to  in writing,  software  distributed
 * under the License is distributed  on  an  "AS IS"  BASIS,  WITHOUT  WARRANTIES  OR
 * CONDITIONS OF ANY KIND, either  express  or  implied.  See  the  License  for  the
 * specific language governing permissions and limitations under the License.
 ************************************************************************************
 */
package org.encuestame.utils.web;



/**
 * Unit Permission Bean.
 * @author Picado, Juan juan@encuestame.org
 * @since 14/05/2009 12:56:37
 * @version $Id$
 */
public class UnitPermission{

    private Long id;
    private String permission;
    private String description;
    /**
     * @return the id
     */
    public final Long getId() {
        return id;
    }
    /**
     * @param id the id to set
     */
    public final void setId(final Long id) {
        this.id = id;
    }
    /**
     * @return the permission
     */
    public final String getPermission() {
        return permission;
    }
    /**
     * @param permission the permission to set
     */
    public final void setPermission(final String permission) {
        this.permission = permission;
    }
    /**
     * @return the description
     */
    public final String getDescription() {
        return description;
    }
    /**
     * @param description the description to set
     */
    public final void setDescription(final String description) {
        this.description = description;
    }
}